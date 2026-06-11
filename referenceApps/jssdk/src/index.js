

import { Accessibility, Advertising, Device, Metrics, Localization } from './firebolt.js';

// ──────────────────────────────────────────────────────────────────────────
  // Performance Metrics
  // ──────────────────────────────────────────────────────────────────────────
  var PERF = {
    pageStartTime: Date.now(),
    fsmAcquiredTime: null,
    testStartTime: null,
    testEndTime: null,
    methodMetrics: [], // Array of { method, requestTime, responseTime, duration }

    recordFsmAcquired: function() {
      this.fsmAcquiredTime = Date.now();
    },

    recordMethodCall: function(method, requestTime, responseTime) {
      this.methodMetrics.push({
        method: method,
        requestTime: requestTime,
        responseTime: responseTime,
        duration: responseTime - requestTime
      });
    },

    recordTestStart: function() {
      this.testStartTime = Date.now();
    },

    recordTestEnd: function() {
      this.testEndTime = Date.now();
    },

    getPageLoadDuration: function() {
      return this.fsmAcquiredTime ? this.fsmAcquiredTime - this.pageStartTime : null;
    },

    getTotalTestDuration: function() {
      return this.testEndTime && this.testStartTime ? this.testEndTime - this.testStartTime : null;
    },

    getTotalElapsed: function() {
      return Date.now() - this.pageStartTime;
    }
  };

  // ──────────────────────────────────────────────────────────────────────────
  // Navigation and scroll handlers
  // ──────────────────────────────────────────────────────────────────────────

  function setupNavigationButtons() {
    var logUpBtn    = document.getElementById("log-up-btn");
    var logDownBtn  = document.getElementById("log-down-btn");
    var resultsUpBtn   = document.getElementById("results-up-btn");
    var resultsDownBtn = document.getElementById("results-down-btn");
    var logPanel    = document.getElementById("log-panel");
    var resultsPanel   = document.getElementById("results-panel");

    var SCROLL_INCREMENT = 50; // pixels to scroll per button press

    // Scroll functions
    function scrollUp(panel) {
      panel.scrollBy({ top: -SCROLL_INCREMENT, behavior: "smooth" });
    }

    function scrollDown(panel) {
      panel.scrollBy({ top: SCROLL_INCREMENT, behavior: "smooth" });
    }

    // Button event listeners
    logUpBtn.addEventListener("click", function () { scrollUp(logPanel); });
    logDownBtn.addEventListener("click", function () { scrollDown(logPanel); });
    resultsUpBtn.addEventListener("click", function () { scrollUp(resultsPanel); });
    resultsDownBtn.addEventListener("click", function () { scrollDown(resultsPanel); });

    // Set Up Log button as focused by default
    setTimeout(function () {
      logUpBtn.focus();
    }, 100);

    // Optional: keyboard navigation between buttons
    var allButtons = [logUpBtn, logDownBtn, resultsUpBtn, resultsDownBtn];
    allButtons.forEach(function (btn) {
      btn.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") {
          var currentIdx = allButtons.indexOf(btn);
          var nextIdx = (currentIdx + 1) % allButtons.length;
          allButtons[nextIdx].focus();
        } else if (e.key === "ArrowLeft") {
          var currentIdx = allButtons.indexOf(btn);
          var prevIdx = (currentIdx - 1 + allButtons.length) % allButtons.length;
          allButtons[prevIdx].focus();
        }
      });
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // UI helpers
  // ──────────────────────────────────────────────────────────────────────────

  function log(msg, cssClass) {
    var panel = document.getElementById("log-panel");
    var div   = document.createElement("div");
    div.className = "log-entry " + (cssClass || "log-info");
    div.textContent = "[" + new Date().toLocaleTimeString() + "] " + msg;
    panel.appendChild(div);
    panel.scrollTop = panel.scrollHeight;
  }

  function addResult(method, value, isError, duration) {
    var panel = document.getElementById("results-panel");

    // Remove placeholder on first real result
    var placeholder = panel.querySelector(".placeholder");
    if (placeholder) { panel.removeChild(placeholder); }

    var row    = document.createElement("div");
    row.className = "result-row";

    var mCell  = document.createElement("div");
    mCell.className = "result-method";
    mCell.textContent = method + (duration !== undefined ? " [" + duration + "ms]" : "");

    var vCell  = document.createElement("div");
    if (isError) {
      vCell.className = "result-value error-val";
      vCell.textContent = "ERROR: " + value;
    } else if (value === null || value === undefined) {
      vCell.className = "result-value null-val";
      vCell.textContent = "null";
    } else {
      vCell.className = "result-value";
      if (typeof value === "function") {
        vCell.textContent = "function() { … }";
      } else if (typeof value === "object") {
        vCell.textContent = JSON.stringify(value, null, 2);
      } else {
        vCell.textContent = String(value);
      }
    }

    row.appendChild(mCell);
    row.appendChild(vCell);
    panel.appendChild(row);
  }

  function showSummary(ok, errors) {
    var el = document.getElementById("summary");
    var totalDuration = PERF.getTotalTestDuration();
    var testDurationStr = totalDuration ? " in " + totalDuration + "ms" : "";
    el.style.display = "block";
    el.innerHTML =
      "Done &mdash; " +
      "<span class='ok'>" + ok + " passed</span>, " +
      "<span class='err'>" + errors + " failed</span>" +
      " out of " + (ok + errors) + " methods" + testDurationStr + ".";
  }

  function outputPerformanceMetrics(passed, failed) {
    var timestamp = new Date().toISOString();
    var pageLoadTime = PERF.getPageLoadDuration();
    var totalTestTime = PERF.getTotalTestDuration();
    var totalElapsed = PERF.getTotalElapsed();
    
    console.log("\n" + "=".repeat(80));
    console.log("FIREBOLT TEST PERFORMANCE METRICS");
    console.log("=".repeat(80));
    console.log("Timestamp: " + timestamp);
    console.log("\n--- OVERALL TIMING ---");
    console.log("Page Load to FSM Acquired: " + pageLoadTime + "ms");
    console.log("Test Execution Time: " + totalTestTime + "ms");
    console.log("Total Elapsed Time: " + totalElapsed + "ms");
    console.log("\n--- TEST RESULTS ---");
    console.log("Passed: " + passed);
    console.log("Failed: " + failed);
    console.log("Total Methods: " + (passed + failed));
    
    console.log("\n--- PER-METHOD TIMING ---");
    var avgDuration = 0;
    var minDuration = Infinity;
    var maxDuration = 0;
    
    PERF.methodMetrics.forEach(function(metric) {
      console.log(metric.method + ": " + metric.duration + "ms");
      avgDuration += metric.duration;
      minDuration = Math.min(minDuration, metric.duration);
      maxDuration = Math.max(maxDuration, metric.duration);
    });
    
    if (PERF.methodMetrics.length > 0) {
      avgDuration = Math.round(avgDuration / PERF.methodMetrics.length);
      console.log("\n--- STATISTICS ---");
      console.log("Average Method Duration: " + avgDuration + "ms");
      console.log("Min Method Duration: " + minDuration + "ms");
      console.log("Max Method Duration: " + maxDuration + "ms");
    }
    
    // CSV-style output for analysis
    console.log("\n--- CSV FORMAT (for further analysis) ---");
    console.log("Timestamp,PageLoadTime(ms),TestExecutionTime(ms),TotalElapsed(ms),Passed,Failed,Total,AvgMethodTime(ms),MinMethodTime(ms),MaxMethodTime(ms)");
    console.log(timestamp + "," + pageLoadTime + "," + totalTestTime + "," + totalElapsed + "," + passed + "," + failed + "," + (passed + failed) + "," + avgDuration + "," + minDuration + "," + maxDuration);
    
    console.log("\n--- DETAILED METHOD BREAKDOWN (CSV) ---");
    console.log("Method,Duration(ms),RequestTime,ResponseTime");
    PERF.methodMetrics.forEach(function(metric) {
      console.log(metric.method + "," + metric.duration + "," + (metric.requestTime - PERF.pageStartTime) + "," + (metric.responseTime - PERF.pageStartTime));
    });
    
    console.log("=".repeat(80) + "\n");
  }

  async function internalCall(fireboltModule, methodName, params) {
    var methodStartTime = Date.now();
    try {
      var result = await fireboltModule(params);
      var methodEndTime = Date.now();
      var methodDuration = methodEndTime - methodStartTime;
      log(methodName + " Result: " + JSON.stringify(result), "log-info");
      addResult(methodName, result, false, methodDuration);
      PERF.recordMethodCall(methodName, methodStartTime, methodEndTime);
      return { success: true, result: result };
    } catch (err) {
      var methodEndTime = Date.now();
      var methodDuration = methodEndTime - methodStartTime;
      log("Error in " + methodName + ": " + err, "log-error");
      addResult(methodName, null, true, methodDuration);
      PERF.recordMethodCall(methodName, methodStartTime, methodEndTime);
      return { success: false, error: err };
    }
  }

  var ALL_METHODS = [
    { module: Accessibility.closedCaptionsSettings, name: "Accessibility.closedCaptionsSettings" },
    { module: Accessibility.audioDescriptionSettings, name: "Accessibility.audioDescriptionSettings" },
    { module: Accessibility.highContrastUI, name: "Accessibility.highContrastUI" },
    { module: Accessibility.voiceGuidanceSettings, name: "Accessibility.voiceGuidanceSettings" },
    { module: Advertising.advertisingId, name: "Advertising.advertisingId" },
    { module: Device.hdr, name: "Device.hdr" },
    { module: Device.uid, name: "Device.uid" },
    { module: Localization.language, name: "Localization.language" },
    { module: Localization.countryCode, name: "Localization.countryCode" },
    { module: Localization.preferredAudioLanguages, name: "Localization.preferredAudioLanguages" },
    { module: Metrics.startContent, name: "Metrics.startContent" },
    { module: Metrics.stopContent, name: "Metrics.stopContent" },
    { module: Metrics.page, name: "Metrics.page", params: { pageId: "somePageId"} },
    { module: Metrics.error, name: "Metrics.error", params: { type: "network", code: "Some error message", description: "Some error description", visible: true } },
    { module: Metrics.mediaLoadStart, name: "Metrics.mediaLoadStart", params: { entityId: "someMediaId" } },
    { module: Metrics.mediaPlay, name: "Metrics.mediaPlay", params: { entityId: "someMediaId" } },
    { module: Metrics.mediaPlaying, name: "Metrics.mediaPlaying", params: { entityId: "someMediaId" } },
    { module: Metrics.mediaPause, name: "Metrics.mediaPause", params: { entityId: "someMediaId" } },
    { module: Metrics.mediaWaiting, name: "Metrics.mediaWaiting", params: { entityId: "someMediaId" } },
    { module: Metrics.mediaSeeking, name: "Metrics.mediaSeeking", params: { entityId: "someMediaId" } },
    { module: Metrics.mediaSeeked, name: "Metrics.mediaSeeked", params: { entityId: "someMediaId" } },
    { module: Metrics.mediaRateChange, name: "Metrics.mediaRateChange", params: { entityId: "someMediaId", rate: 1.5 } },
    { module: Metrics.mediaRenditionChange, name: "Metrics.mediaRenditionChange", params: { entityId: "someMediaId", bitrate: "1080p", width: 1920, height: 1080   } },
    { module: Metrics.mediaEnded, name: "Metrics.mediaEnded", params: { entityId: "someMediaId" } },
    { module: Metrics.appInfo, name: "Metrics.appInfo", params: { build: "someBuildId"} }
  ]

  async function runTestSuite() {
    PERF.recordTestStart();

    var methodStartTime = Date.now();

    var passed = 0;
    var failed = 0;

    for (var i = 0; i < ALL_METHODS.length; i++) {
      var m = ALL_METHODS[i];
      var result = await internalCall(m.module, m.name, m.params);
      if (result.success) {
        passed++;
      } else {
        failed++;
      }
    }

    PERF.recordTestEnd();
    showSummary(passed, failed);
    log("All done. " + passed + " passed, " + failed + " failed.", failed > 0 ? "log-error" : "log-success");
    
    // Output performance metrics to console
    outputPerformanceMetrics(passed, failed);
  }


  async function main() {
      setupNavigationButtons();
      await runTestSuite();
  }

export function run() {

  if (document.readyState === "loading") {
      // DOM not ready yet
      window.addEventListener("DOMContentLoaded", main);
  } else {
      // DOM already ready
      main();
  }
}
