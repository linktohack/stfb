declare global {
  /**
   * Window with STFB
   */
  interface Window {
    STFB: {
      // how to declare all the export here
    } & ((into?: any) => void);
  }
}

import * as core from "./core";
import * as stdlib from "./stdlib";

((window: Window) => {
  const savedSTFB = window.STFB;

  window.STFB = ((into?: any) => {
    into = into || window;
    Object.assign(into, core);
    Object.assign(into, stdlib);

    if (savedSTFB) {
      window.STFB = savedSTFB;
    }
  }) as any;

  Object.assign(window.STFB, core);
  Object.assign(window.STFB, stdlib);
})(window);
