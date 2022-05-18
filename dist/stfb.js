import * as core from "./core";
import * as stdlib from "./stdlib";
window.STFB = {
    core,
    stdlib,
    inject(into) {
        into = into || window;
        Object.assign(into, core);
        Object.assign(into, stdlib);
    },
};
//# sourceMappingURL=stfb.js.map