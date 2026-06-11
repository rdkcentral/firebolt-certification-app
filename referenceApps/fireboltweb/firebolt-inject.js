(function(global) {

  "use strict";

  // ---------------------------------------------------------------------------
  // Private state
  // ---------------------------------------------------------------------------
  var _transport = null;
  var _transportSet = false;
  var _connecting = false;
  var _connected = false;
  var _fireboltInstance = null;
  var _connectionResolvers = [];
  var _nextId = 1;
  var _pendingCalls = Object.create(null); // id → { isSubscribe, resolve, reject }
  var _eventListeners = Object.create(null); // "Module.onEvent" → [callbacks]

  // --- Generated data ---
  var _VERSION = "9.0";
  
  var _methodRegistry = {
    "Accessibility.audioDescription": {"kind":"call"},
    "Accessibility.onAudioDescriptionChanged": {"kind":"subscribe","eventIsPrimitive":true},
    "Accessibility.closedCaptionsSettings": {"kind":"call"},
    "Accessibility.onClosedCaptionsSettingsChanged": {"kind":"subscribe","eventIsPrimitive":false},
    "Accessibility.highContrastUI": {"kind":"call"},
    "Accessibility.onHighContrastUIChanged": {"kind":"subscribe","eventIsPrimitive":true},
    "Accessibility.voiceGuidanceSettings": {"kind":"call"},
    "Accessibility.onVoiceGuidanceSettingsChanged": {"kind":"subscribe","eventIsPrimitive":false},
    "Actions.start": {"kind":"call"},
    "Actions.intent": {"kind":"call"},
    "Actions.onIntent": {"kind":"subscribe","eventIsPrimitive":false},
    "Advertising.advertisingId": {"kind":"call"},
    "Device.uid": {"kind":"call"},
    "Device.deviceClass": {"kind":"call"},
    "Device.hdr": {"kind":"call"},
    "Device.onHdrChanged": {"kind":"subscribe","eventIsPrimitive":false},
    "Device.dolbyAtmosExperienceAvailable": {"kind":"call"},
    "Device.onDolbyAtmosExperienceAvailableChanged": {"kind":"subscribe","eventIsPrimitive":true},
    "Discovery.watched": {"kind":"call"},
    "Display.colorimetry": {"kind":"call"},
    "Display.videoResolutions": {"kind":"call"},
    "Localization.country": {"kind":"call"},
    "Localization.onCountryChanged": {"kind":"subscribe","eventIsPrimitive":true},
    "Localization.preferredAudioLanguages": {"kind":"call"},
    "Localization.onPreferredAudioLanguagesChanged": {"kind":"subscribe","eventIsPrimitive":false},
    "Localization.presentationLanguage": {"kind":"call"},
    "Localization.onPresentationLanguageChanged": {"kind":"subscribe","eventIsPrimitive":true},
    "Metrics.ready": {"kind":"call"},
    "Metrics.startContent": {"kind":"call"},
    "Metrics.stopContent": {"kind":"call"},
    "Metrics.page": {"kind":"call"},
    "Metrics.error": {"kind":"call"},
    "Metrics.mediaLoadStart": {"kind":"call"},
    "Metrics.mediaPlay": {"kind":"call"},
    "Metrics.mediaPlaying": {"kind":"call"},
    "Metrics.mediaPause": {"kind":"call"},
    "Metrics.mediaWaiting": {"kind":"call"},
    "Metrics.mediaSeeking": {"kind":"call"},
    "Metrics.mediaSeeked": {"kind":"call"},
    "Metrics.mediaRateChanged": {"kind":"call"},
    "Metrics.mediaRenditionChanged": {"kind":"call"},
    "Metrics.mediaEnded": {"kind":"call"},
    "Metrics.event": {"kind":"call"},
    "Metrics.appInfo": {"kind":"call"},
    "Network.connected": {"kind":"call"},
    "Network.onConnectedChanged": {"kind":"subscribe","eventIsPrimitive":true},
    "VideoOutput.resolution": {"kind":"call"},
    "VideoOutput.onResolutionChanged": {"kind":"subscribe","eventIsPrimitive":true}
  };
  
  // --- End generated data ---

  // ---------------------------------------------------------------------------
  // Transport layer
  // ---------------------------------------------------------------------------
  function _onMessage(raw) {
    var message;
    try { message = JSON.parse(raw); } catch (e) { return; }

    // Has id → call response or subscribe ack
    if (message.id !== undefined) {
      var pending = _pendingCalls[message.id];
      if (!pending) return;
      delete _pendingCalls[message.id];

      if (message.error) {
        var errMsg = (message.error.message || "Firebolt error") + " (code: " + message.error.code + ")";
        if (pending.isSubscribe) {
          // Remove eagerly-registered listener on subscribe failure
          var listeners = _eventListeners[pending.eventName];
          if (listeners) {
            var idx = listeners.indexOf(pending.callback);
            if (idx !== -1) listeners.splice(idx, 1);
          }
        }
        pending.reject(new Error(errMsg));
        return;
      }

      if (pending.isSubscribe) {
        // result: null → subscription confirmed; resolve with unsubscribe fn
        pending.resolve(pending.unsubscribeFn);
        return;
      }

      // Regular call response
      pending.resolve(message.result);
      return;
    }

    // No id, has method → Firebolt 9 event notification
    if (message.method) {
      var eventName = message.method;
      var entry = _methodRegistry[eventName];
      if (!entry || entry.kind !== "subscribe") return;

      var payload = entry.eventIsPrimitive
        ? (message.params ? message.params.value : undefined)
        : message.params;

      var cbs = _eventListeners[eventName];
      if (cbs) {
        for (var i = 0; i < cbs.length; i++) { cbs[i](payload); }
      }
    }
  }

  function _onStatus(status) {
    _connected = (status === "connected");
    if (_connected) {
      if (!_fireboltInstance) { _fireboltInstance = _buildFireboltInstance(); }
      var resolvers = _connectionResolvers.splice(0);
      for (var i = 0; i < resolvers.length; i++) { resolvers[i](_fireboltInstance); }
    }
  }

  function _rpcCall(methodName, params) {
    return new Promise(function (resolve, reject) {
      var id = _nextId++;
      _pendingCalls[id] = {
        isSubscribe: false,
        resolve: resolve,
        reject: reject,
      };
      var msg = JSON.stringify({ jsonrpc: "2.0", id: id, method: methodName, params: params || {} });
      var result = _transport.send(msg);
      if (!result.success) {
        delete _pendingCalls[id];
        reject(new Error("Transport send failed (errorCode: " + result.errorCode + ")"));
      }
    });
  }

  function _subscribe(eventName, callback) {
    if (!_eventListeners[eventName]) { _eventListeners[eventName] = []; }
    _eventListeners[eventName].push(callback); // eager registration

    return new Promise(function (resolve, reject) {
      var id = _nextId++;

      function unsubscribeFn() {
        var ls = _eventListeners[eventName];
        if (ls) {
          var i = ls.indexOf(callback);
          if (i !== -1) ls.splice(i, 1);
        }
        if (!ls || ls.length === 0) {
          var unsubId = _nextId++;
          _pendingCalls[unsubId] = { isSubscribe: true, eventName: eventName, callback: null, unsubscribeFn: null, resolve: function(){}, reject: function(){} };
          var unsubMsg = JSON.stringify({ jsonrpc: "2.0", id: unsubId, method: eventName, params: { listen: false } });
          _transport.send(unsubMsg);
        }
      }

      _pendingCalls[id] = {
        isSubscribe: true,
        eventName: eventName,
        callback: callback,
        unsubscribeFn: unsubscribeFn,
        resolve: resolve,
        reject: reject,
      };

      var msg = JSON.stringify({ jsonrpc: "2.0", id: id, method: eventName, params: { listen: true } });
      var result = _transport.send(msg);
      if (!result.success) {
        delete _pendingCalls[id];
        var ls = _eventListeners[eventName];
        if (ls) { var i = ls.indexOf(callback); if (i !== -1) ls.splice(i, 1); }
        reject(new Error("Transport send failed (errorCode: " + result.errorCode + ")"));
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Stub factories
  // ---------------------------------------------------------------------------
  function _makeCallStub(fullMethodName) {
    return function (params) {
      return _rpcCall(fullMethodName, params || {});
    };
  }

  function _makeSubscribeStub(fullMethodName) {
    return function (callback) {
      return _subscribe(fullMethodName, callback);
    };
  }

  // ---------------------------------------------------------------------------
  // FireboltClient builder
  // ---------------------------------------------------------------------------
  function _buildFireboltInstance() {
    var modules = Object.create(null);
    for (var fullName in _methodRegistry) {
      var dotIdx = fullName.indexOf(".");
      var modName = fullName.slice(0, dotIdx);
      var methodName = fullName.slice(dotIdx + 1);
      var desc = _methodRegistry[fullName];
      if (!modules[modName]) { modules[modName] = Object.create(null); }
      modules[modName][methodName] = desc.kind === "subscribe"
        ? _makeSubscribeStub(fullName)
        : _makeCallStub(fullName);
    }
    var client = Object.create(null);
    for (var mod in modules) { client[mod] = Object.freeze(modules[mod]); }
    // Add disconnect method
    client.disconnect = function() {
      _disconnect();
      _fireboltInstance = null;
    };
    return Object.freeze(client);
  }

  // ---------------------------------------------------------------------------
  // Disconnect handler
  // ---------------------------------------------------------------------------
  function _disconnect() {
    // Call transport disconnect
    if (_transport && _transport.disconnect) {
      _transport.disconnect();
    }
    // Clear event listeners
    for (var key in _eventListeners) {
      _eventListeners[key] = [];
    }
    // Reject all pending calls with DisconnectError
    for (var id in _pendingCalls) {
      var pending = _pendingCalls[id];
      pending.reject(new Error("Disconnected"));
    }
    _pendingCalls = Object.create(null);
    // Clear pending connection resolvers
    _connectionResolvers = [];
    // Reset state
    _connected = false;
    _connecting = false;
    _fireboltInstance = null;
  }

  // ---------------------------------------------------------------------------
  // configure / get
  // ---------------------------------------------------------------------------
  function _setTransport(transport) {
    if (_transportSet) {
      throw new Error("Transport already set on FireboltServiceManager");
    }
    
    // Validate that transport has all required methods
    var requiredMethods = ["send", "onMessage", "onConnectionStatus", "connect", "disconnect"];
    for (var i = 0; i < requiredMethods.length; i++) {
      var method = requiredMethods[i];
      if (typeof transport[method] !== "function") {
        throw new Error(
          "Transport object must have a '" + method + "' method. " +
          "Missing or invalid method: " + method
        );
      }
    }
    
    _transport = transport;
    _transportSet = true;
  }

  function _get() {
    if (!_transport) {
      throw new Error(
        "Transport not set via FireboltServiceManager.transport(). " +
        "The WPE extension must call FireboltServiceManager.transport(t) first."
      );
    }
    if (_connected && _fireboltInstance) { return Promise.resolve(_fireboltInstance); }
    var p = new Promise(function (resolve) { _connectionResolvers.push(resolve); });
    if (!_connecting) {
      _connecting = true;
      _transport.onMessage(_onMessage);
      _transport.onConnectionStatus(_onStatus);
      _transport.connect();
    }
    return p;
  }


  var _fsm = Object.freeze({
    version: _VERSION,
    transport: _setTransport,
    get: _get,
  });
  Object.defineProperty(global, "FireboltServiceManager", {
    value: _fsm,
    writable: false,
    configurable: false,
    enumerable: true,
  });

})(typeof globalThis !== "undefined" ? globalThis : window);