declare global {
  /**
   * Window with STFB
   */
  interface Window {
    STFB: {
      core: any;
      stdlib: any;
      inject: (into: any) => void;
    };
  }
}

import * as core from "./core";
import * as stdlib from "./stdlib";

window.STFB = {
  core,
  stdlib,
  inject(into: any) {
    into = into || window;
    Object.assign(into, core);
    Object.assign(into, stdlib);
  },
};
