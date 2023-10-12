/**
 * Copyright 2023 Comcast Cable Communications Management, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import lng from '@lightningjs/core';
import { Button, Column } from '@lightningjs/ui-components';
const logger = require('./utils/Logger')('Menu.js');
export default class MainPage extends lng.Component {
  static _template() {
    return {
      x: 0,
      y: 0,
      w: (w) => w,
      h: (h) => h,
      Menu: {
        type: Column,
        w: (w) => w,
        h: (h) => h,
        x: 100,
        y: 100,
      },
    };
  }

  _init() {}

  set menus(menus) {
    this._menuStack = [];
    this._menus = menus;
    this._pushMenu(menus);
  }

  set initialMenu(im) {
    if (im == null) return;
    const menuPaths = im.split('/');
    let curItem = this.menus;
    for (let i = 0; i < menuPaths.length; i++) {
      const nextItem = curItem.find((m) => m.title.toLowerCase().replace(/\s/g, '') === menuPaths[i].toLowerCase().replace(/\s/g, ''));
      if (nextItem) {
        curItem = nextItem.menus;
        this._selectItem(nextItem);
      } else {
        logger.error('Could not find menu ' + menuPaths[i]);
        return;
      }
    }
  }

  get menus() {
    return this._menus;
  }

  _pushMenu(menu) {
    this._menuStack.push(menu);
    this._renderMenu(menu);
  }

  _selectItem(item) {
    if (item.menus) {
      this._pushMenu(item.menus);
    } else if (item.view) {
      this._pushView(item);
    } else if (item.Validationresult) {
      this.fireAncestors('$result_fetch', item);
    }
  }

  _renderMenu(menu) {
    const items = menu.map((item) => ({
      type: Button,
      title: item.title,
      validatedMenu: item,
      backgroundType: 'stroke',
      minWidth: this.subMenuWidth || 550,
      onEnterRelease: () => {
        this._selectItem(item);
      },
    }));
    this.patch({
      Wrapper: {
        Menu: undefined,
      },
    });
    this.patch({
      Wrapper: {
        h: 700,
        w: 510,
        x: 0,
        y: 100,
        clipping: true,
        Menu: {
          type: Column,
          x: 20,
          y: 0,
          w: 500,
          h: 500,
          scrollIndex: 0,
          alwaysScroll: false,
          items: items,
        },
      },
    });
    this._refocus();
  }

  _pushView(itm) {
    this._menuStack.push(itm);
    this._renderView(itm);
  }

  _renderView(itm) {
    this.patch({
      View: {
        type: itm.view,
        w: (w) => w,
        h: (h) => h,
        params: itm.params,
      },
    });
    this.patch({
      Wrapper: {
        Menu: undefined,
      },
    });
    this._refocus();
  }

  _handleBackRelease(keyEvent) {
    keyEvent.preventDefault();
    if (this._menuStack.length <= 1) return false;
    const removed = this._menuStack.pop();
    if (removed.view) {
      this.patch({
        View: undefined,
      });
    }
    const next = this._menuStack[this._menuStack.length - 1];
    this._renderMenu(next);
    this._refocus();
    return true;
  }

  _getFocused() {
    return this.tag('Wrapper.Menu') ? this.tag('Wrapper.Menu') : this.tag('View');
  }
}
