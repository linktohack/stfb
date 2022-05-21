import * as core from "./core";
import * as stdlib from "./stdlib";
((window) => {
    const savedSTFB = window.STFB;
    window.STFB = ((into) => {
        into = into || window;
        Object.assign(into, core);
        Object.assign(into, stdlib);
        if (savedSTFB) {
            window.STFB = savedSTFB;
        }
    });
    Object.assign(window.STFB, core);
    Object.assign(window.STFB, stdlib);
})(window);
//# sourceMappingURL=stfb.js.map