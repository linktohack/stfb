/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/core.ts":
/*!*********************!*\
  !*** ./src/core.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CreateDefaultCamera": () => (/* binding */ CreateDefaultCamera),
/* harmony export */   "CreateDefaultLight": () => (/* binding */ CreateDefaultLight),
/* harmony export */   "Entity": () => (/* binding */ Entity),
/* harmony export */   "Scene": () => (/* binding */ Scene),
/* harmony export */   "System": () => (/* binding */ System)
/* harmony export */ });
/* harmony import */ var babylonjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! babylonjs */ "babylonjs");
/* harmony import */ var babylonjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(babylonjs__WEBPACK_IMPORTED_MODULE_0__);
/**
 * @packageDocumentation Super Tiny Foundation for BABYLON, enables ECS principle on BABYLON scenes
 * @author Quang-Linh LE
 *
 * System: Global state
 * Component: Function that takes `entity' as its first argument,
 *   enhances, modifies its behavior in some ways
 * Entity: Function that take `scene` as its sole argument,
 *   returns Node, Mesh, Feature etc... that can be enhanced by Component
 */

/**
 * Bootstrap a new system with a `registry'
 *
 * @param registry global state
 * @param opt optional { noUniqueCheck: false }
 * @returns { setElForId, findElById }
 */
function System(registry, opt) {
    const noUniqueCheck = opt?.noUniqueCheck ?? false;
    return {
        setElForId(el, id) {
            if (el === undefined) {
                if (!registry[id]) {
                    if (noUniqueCheck) {
                        console.trace(`Try to unset an id \`${id}''`);
                        delete registry[id];
                    }
                    else {
                        throw new Error(`Try to unset an id \`${id}''`);
                    }
                }
                else {
                    delete registry[id];
                }
            }
            else if (registry[id]) {
                if (el !== registry[id]) {
                    if (noUniqueCheck) {
                        console.trace(`Id \`${id}' is already reserved for \'${registry[id]}'`);
                        registry[id] = el;
                    }
                    else {
                        throw new Error(`Id \`${id}' is already reserved for \'${registry[id]}'`);
                    }
                }
                else {
                    registry[id] = el;
                }
            }
            else {
                registry[id] = el;
            }
        },
        findElById(id) {
            return registry[id];
        },
    };
}
/**
 * Bootstrap a scene
 * @param sceneOrCanvas
 * @param param1
 * @returns
 */
async function Scene(sceneOrCanvas, { components, children, }) {
    let canvas;
    let engine;
    let scene;
    // Do we need a default scene?
    if (sceneOrCanvas instanceof babylonjs__WEBPACK_IMPORTED_MODULE_0__.Scene) {
        scene = sceneOrCanvas;
        engine = scene.getEngine();
        canvas = engine.getRenderingCanvas();
    }
    else {
        canvas =
            sceneOrCanvas instanceof HTMLCanvasElement
                ? sceneOrCanvas
                : document.createElement("canvas");
        canvas.style.cssText = "width: 100%; height: 100%; touch-action: none;";
        document.body.appendChild(canvas);
        engine = new babylonjs__WEBPACK_IMPORTED_MODULE_0__.Engine(canvas, true, {
            preserveDrawingBuffer: true,
            stencil: true,
            disableWebGL2Support: false,
        });
        scene = new babylonjs__WEBPACK_IMPORTED_MODULE_0__.Scene(engine);
    }
    for (const component of components || []) {
        if (Array.isArray(component)) {
            const [fn, ...args] = component;
            await fn(scene, ...args);
        }
        else {
            await component(scene);
        }
    }
    const childEls = await Promise.all((children || []).map((childFn) => childFn(scene)));
    // Do we need a default light?
    let light = childEls.find((el) => el instanceof babylonjs__WEBPACK_IMPORTED_MODULE_0__.Light);
    if (!light) {
        light = CreateDefaultLight(scene);
    }
    // Do we need a default camera?
    let camera = childEls.find((el) => el instanceof babylonjs__WEBPACK_IMPORTED_MODULE_0__.Camera);
    if (!camera) {
        camera = CreateDefaultCamera(scene);
    }
    engine.runRenderLoop(() => scene.render());
    return scene;
}
/**
 * Entity is basically a Mesh or a Feature that its behavior can be modified by some functions (Components)
 * and may have children that are also Entities
 * @param fn
 * @param opt  { components, children }
 * @returns
 */
function Entity(fn, { components, children, } = { components: [], children: [] }) {
    return async (scene) => {
        const el = await fn(scene);
        for (const component of components || []) {
            if (Array.isArray(component)) {
                const [fn, ...args] = component;
                await fn(el, ...args);
            }
            else {
                await component(el);
            }
        }
        for (const childFn of children || []) {
            let childEl = await childFn(scene);
            if (Array.isArray(childEl)) {
                for (const c of childEl) {
                    if (!(c instanceof babylonjs__WEBPACK_IMPORTED_MODULE_0__.WebXRDefaultExperience)) {
                        c.parent = el;
                    }
                }
            }
            else {
                if (!(childEl instanceof babylonjs__WEBPACK_IMPORTED_MODULE_0__.WebXRDefaultExperience)) {
                    childEl.parent = el;
                }
            }
        }
        if (false) {}
        return el;
    };
}
/**
 * Create a default Light for `scene` (if not exist)
 *
 * A `Component` for `scene`
 * @param scene
 * @returns
 */
function CreateDefaultLight(scene) {
    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new babylonjs__WEBPACK_IMPORTED_MODULE_0__.HemisphericLight("light", new babylonjs__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 1, 0), scene);
    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;
    return light;
}
/**
 * Create a default Camera for `scene` (if not exist)
 *
 * A `Component` for `scene`
 * @param scene
 * @returns
 */
function CreateDefaultCamera(scene) {
    // This creates and positions a free camera (non-mesh)
    const camera = new babylonjs__WEBPACK_IMPORTED_MODULE_0__.FreeCamera("camera", new babylonjs__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 5, -10), scene);
    // This targets the camera to scene origin
    camera.setTarget(babylonjs__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero());
    // This attaches the camera to the canvas
    camera.attachControl(scene.getEngine().getRenderingCanvas(), true);
    return camera;
}


/***/ }),

/***/ "./src/stdlib.ts":
/*!***********************!*\
  !*** ./src/stdlib.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "XR": () => (/* binding */ XR),
/* harmony export */   "enableDebug": () => (/* binding */ enableDebug),
/* harmony export */   "enablePhysics": () => (/* binding */ enablePhysics),
/* harmony export */   "onPickedDown": () => (/* binding */ onPickedDown),
/* harmony export */   "onPickedUp": () => (/* binding */ onPickedUp),
/* harmony export */   "replaceEntity": () => (/* binding */ replaceEntity),
/* harmony export */   "withBlueMat": () => (/* binding */ withBlueMat),
/* harmony export */   "withGreenMat": () => (/* binding */ withGreenMat),
/* harmony export */   "withHandTracking": () => (/* binding */ withHandTracking),
/* harmony export */   "withPBRMatByColor": () => (/* binding */ withPBRMatByColor),
/* harmony export */   "withPhysics": () => (/* binding */ withPhysics),
/* harmony export */   "withPointerSelection": () => (/* binding */ withPointerSelection),
/* harmony export */   "withRedMat": () => (/* binding */ withRedMat),
/* harmony export */   "withTeleportation": () => (/* binding */ withTeleportation),
/* harmony export */   "withYellowMat": () => (/* binding */ withYellowMat)
/* harmony export */ });
/* harmony import */ var babylonjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! babylonjs */ "babylonjs");
/* harmony import */ var babylonjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(babylonjs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./core */ "./src/core.ts");
/**
 * @packageDocumentation Super Tiny Foundation for BABYLON, stdlib
 * @author Quang-Linh LE
 */
// Physics


/**
 * Compnent: Enable physics for `scene'
 * @param scene
 */
async function enablePhysics(scene) {
    scene.enablePhysics(new babylonjs__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, -9.81, 0), new babylonjs__WEBPACK_IMPORTED_MODULE_0__.AmmoJSPlugin());
}
/**
 * Component: With physics enabled on scene, enable it for mesh `el'
 * @param el
 * @param mass
 * @param restitution
 */
function withPhysics(el, mass, restitution) {
    const physicsImpostor = new babylonjs__WEBPACK_IMPORTED_MODULE_0__.PhysicsImpostor(el, babylonjs__WEBPACK_IMPORTED_MODULE_0__.PhysicsImpostor.SphereImpostor, { mass, restitution }, el.getScene());
    el.physicsImpostor = physicsImpostor;
}
// Debug
/**
 * Component: Enable debug for scene
 * @param scene
 */
async function enableDebug(scene) {
    scene.debugLayer.show();
}
// Material
function withPBRMatByColor(el, color) {
    const mat = new babylonjs__WEBPACK_IMPORTED_MODULE_0__.PBRMaterial("blue", el.getScene());
    mat.albedoColor = babylonjs__WEBPACK_IMPORTED_MODULE_0__.Color3.FromHexString(color);
    mat.metallic = 0.99;
    mat.roughness = 0.01;
    el.material = mat;
}
function withRedMat(el) {
    return withPBRMatByColor(el, "#EF2D5E");
}
function withGreenMat(el) {
    return withPBRMatByColor(el, "#7BC8A4");
}
function withBlueMat(el) {
    return withPBRMatByColor(el, "#4CC3D9");
}
function withYellowMat(el) {
    return withPBRMatByColor(el, "#FFC65D");
}
// XR
/**
 * Entity: Add XR on `scene'
 * @param scene
 */
async function XR(scene) {
    return scene.createDefaultXRExperienceAsync();
}
/**
 * Enable Pointer Selection
 *
 * A Component for `xrHelper`
 * @param xrHelper
 */
async function withPointerSelection(xrHelper) {
    const featuresManager = xrHelper.baseExperience.featuresManager;
    featuresManager.enableFeature(babylonjs__WEBPACK_IMPORTED_MODULE_0__.WebXRFeatureName.POINTER_SELECTION, "stable", {
        xrInput: xrHelper.input,
        enablePointerSelectionOnAllControllers: true,
    });
}
/**
 * Enable Teleportation
 *
 * A Component for `xrHelper`
 * @param xrHelper
 * @param floors
 */
async function withTeleportation(xrHelper, floors) {
    const featuresManager = xrHelper.baseExperience.featuresManager;
    let floorMeshes;
    if (floors instanceof Function) {
        floorMeshes = floors();
    }
    else {
        if (!floors || floors.length === 0) {
            const scene = xrHelper.baseExperience.sessionManager.scene;
            const ground = babylonjs__WEBPACK_IMPORTED_MODULE_0__.MeshBuilder.CreateGround("ground", {
                width: 400,
                height: 400,
            }, scene);
            floors = [ground];
        }
        floorMeshes = floors;
    }
    featuresManager.enableFeature(babylonjs__WEBPACK_IMPORTED_MODULE_0__.WebXRFeatureName.TELEPORTATION, "stable", {
        xrInput: xrHelper.input,
        floorMeshes: floorMeshes,
        snapPositions: [],
    });
}
/**
 * Enable handtracking
 *
 * A Component for `xrHelper`
 * @param xrHelper
 * @param setElForId
 * @param leftHandId
 * @param rightHandId
 */
async function withHandTracking(xrHelper, setElForId, leftHandId = "leftHand", rightHandId = "rightHand") {
    const featuresManager = xrHelper.baseExperience.featuresManager;
    const availableFeatures = babylonjs__WEBPACK_IMPORTED_MODULE_0__.WebXRFeaturesManager.GetAvailableFeatures();
    if (availableFeatures.find((it) => it === babylonjs__WEBPACK_IMPORTED_MODULE_0__.WebXRFeatureName.HAND_TRACKING)) {
        try {
            const xrHandFeature = featuresManager.enableFeature(babylonjs__WEBPACK_IMPORTED_MODULE_0__.WebXRFeatureName.HAND_TRACKING, "latest", {
                xrInput: xrHelper.input,
                jointMeshes: {
                    enablePhysics: true,
                    physicsProps: {
                        friction: 0.5,
                        restitution: 0.3,
                    },
                },
            });
            xrHandFeature.onHandAddedObservable.add((hand) => {
                console.log("HAND ADDED", hand);
                if (hand.xrController.inputSource.handedness === "left") {
                    setElForId(hand, leftHandId);
                }
                if (hand.xrController.inputSource.handedness === "right") {
                    setElForId(hand, rightHandId);
                }
            });
            xrHandFeature.onHandRemovedObservable.add((hand) => {
                console.log("HAND REMOVED", hand);
                if (hand.xrController.inputSource.handedness === "left") {
                    setElForId(undefined, leftHandId);
                }
                if (hand.xrController.inputSource.handedness === "right") {
                    setElForId(undefined, rightHandId);
                }
            });
        }
        catch (e) {
            console.log("withHandTracking", "Unable to enable hand tracking");
        }
    }
}
// Pick
/**
 * Component: Action when the mesh has been pick (but not neccessary release)
 * @param el
 * @param setElForId
 * @param cb
 */
async function onPickedDown(el, setElForId, cb) {
    const scene = el.getScene();
    // FIXME(QL): How to cleanup?
    const observer = scene.onPointerObservable.add((pointerInfo) => {
        switch (pointerInfo.type) {
            case babylonjs__WEBPACK_IMPORTED_MODULE_0__.PointerEventTypes.POINTERDOWN:
                if (pointerInfo.pickInfo.hit) {
                    let pickedMesh = pointerInfo.pickInfo.pickedMesh;
                    let pointerId = pointerInfo.event.pointerId;
                    if (pickedMesh === el) {
                        setElForId(pointerId, observer);
                        cb(pointerInfo);
                    }
                }
                break;
        }
    });
}
/**
 * Component: Action when mesh has been release, should work only when `onPickedDown` is also set
 * @param el
 * @param findElById
 * @param cb
 */
async function onPickedUp(el, findElById, cb) {
    const scene = el.getScene();
    // FIXME(QL): How to cleanup?
    const observer = scene.onPointerObservable.add((pointerInfo) => {
        switch (pointerInfo.type) {
            case babylonjs__WEBPACK_IMPORTED_MODULE_0__.PointerEventTypes.POINTERUP:
                let pointerId = pointerInfo.event.pointerId;
                if (findElById(pointerId)) {
                    cb(pointerId);
                }
                break;
        }
    });
}
// HMR: Replace Entity
/**
 * Replace an entity with a new `fn`, while preseve the `components` and `children`
 *
 * Only work with HMR enabled (or `module.hot` is truthy)
 * @param el
 * @returns
 */
async function replaceEntity(el, newElFn) {
    if (!el) {
        console.trace("replaceEntity", "Entity not found");
        return;
    }
    let scene;
    if (el instanceof babylonjs__WEBPACK_IMPORTED_MODULE_0__.WebXRDefaultExperience) {
        scene = el.baseExperience.camera.getScene();
    }
    else {
        scene = el.getScene();
    }
    const parent = el.parent; // If it exists
    const { fn: _, components, children } = el.__hot__data__;
    if (el.physicsImpostor) {
        el.physicsImpostor.dispose();
    }
    el.dispose();
    const newEl = await (0,_core__WEBPACK_IMPORTED_MODULE_1__.Entity)(newElFn, {
        components,
        children,
    })(scene);
    newEl.parent = parent;
}


/***/ }),

/***/ "babylonjs":
/*!**************************!*\
  !*** external "BABYLON" ***!
  \**************************/
/***/ ((module) => {

module.exports = BABYLON;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*********************!*\
  !*** ./src/stfb.ts ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core */ "./src/core.ts");
/* harmony import */ var _stdlib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stdlib */ "./src/stdlib.ts");


((window) => {
    const savedSTFB = window.STFB;
    window.STFB = ((into) => {
        into = into || window;
        Object.assign(into, _core__WEBPACK_IMPORTED_MODULE_0__);
        Object.assign(into, _stdlib__WEBPACK_IMPORTED_MODULE_1__);
        if (savedSTFB) {
            window.STFB = savedSTFB;
        }
    });
    Object.assign(window.STFB, _core__WEBPACK_IMPORTED_MODULE_0__);
    Object.assign(window.STFB, _stdlib__WEBPACK_IMPORTED_MODULE_1__);
})(window);

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUM7UUFDdEIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsa0NBQUksQ0FBQyxDQUFDO1FBQzFCLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLG9DQUFNLENBQUMsQ0FBQztRQUU1QixJQUFJLFNBQVMsRUFBRTtZQUNiLE1BQU0sQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO1NBQ3pCO0lBQ0gsQ0FBQyxDQUFRLENBQUM7SUFFVixNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsa0NBQUksQ0FBQyxDQUFDO0lBQ2pDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxvQ0FBTSxDQUFDLENBQUM7QUFDckMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zdGZiLy4vc3JjL2NvcmUudHMiLCJ3ZWJwYWNrOi8vc3RmYi8uL3NyYy9zdGRsaWIudHMiLCJ3ZWJwYWNrOi8vc3RmYi9leHRlcm5hbCB2YXIgXCJCQUJZTE9OXCIiLCJ3ZWJwYWNrOi8vc3RmYi93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9zdGZiL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3N0ZmIvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3N0ZmIvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9zdGZiL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vc3RmYi8uL3NyYy9zdGZiLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQHBhY2thZ2VEb2N1bWVudGF0aW9uIFN1cGVyIFRpbnkgRm91bmRhdGlvbiBmb3IgQkFCWUxPTiwgZW5hYmxlcyBFQ1MgcHJpbmNpcGxlIG9uIEJBQllMT04gc2NlbmVzXG4gKiBAYXV0aG9yIFF1YW5nLUxpbmggTEVcbiAqXG4gKiBTeXN0ZW06IEdsb2JhbCBzdGF0ZVxuICogQ29tcG9uZW50OiBGdW5jdGlvbiB0aGF0IHRha2VzIGBlbnRpdHknIGFzIGl0cyBmaXJzdCBhcmd1bWVudCxcbiAqICAgZW5oYW5jZXMsIG1vZGlmaWVzIGl0cyBiZWhhdmlvciBpbiBzb21lIHdheXNcbiAqIEVudGl0eTogRnVuY3Rpb24gdGhhdCB0YWtlIGBzY2VuZWAgYXMgaXRzIHNvbGUgYXJndW1lbnQsXG4gKiAgIHJldHVybnMgTm9kZSwgTWVzaCwgRmVhdHVyZSBldGMuLi4gdGhhdCBjYW4gYmUgZW5oYW5jZWQgYnkgQ29tcG9uZW50XG4gKi9cblxuaW1wb3J0ICogYXMgQkFCWUxPTiBmcm9tIFwiYmFieWxvbmpzXCI7XG5cbmV4cG9ydCB0eXBlIElFbnRpdHkgPVxuICB8IEJBQllMT04uTm9kZVxuICB8IEJBQllMT04uQ2FtZXJhXG4gIHwgQkFCWUxPTi5XZWJYUkRlZmF1bHRFeHBlcmllbmNlO1xuXG4vKipcbiAqIEJvb3RzdHJhcCBhIG5ldyBzeXN0ZW0gd2l0aCBhIGByZWdpc3RyeSdcbiAqXG4gKiBAcGFyYW0gcmVnaXN0cnkgZ2xvYmFsIHN0YXRlXG4gKiBAcGFyYW0gb3B0IG9wdGlvbmFsIHsgbm9VbmlxdWVDaGVjazogZmFsc2UgfVxuICogQHJldHVybnMgeyBzZXRFbEZvcklkLCBmaW5kRWxCeUlkIH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIFN5c3RlbShyZWdpc3RyeSwgb3B0PzogeyBub1VuaXF1ZUNoZWNrOiBib29sZWFuIH0pIHtcbiAgY29uc3Qgbm9VbmlxdWVDaGVjayA9IG9wdD8ubm9VbmlxdWVDaGVjayA/PyBmYWxzZTtcbiAgcmV0dXJuIHtcbiAgICBzZXRFbEZvcklkKGVsLCBpZCkge1xuICAgICAgaWYgKGVsID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKCFyZWdpc3RyeVtpZF0pIHtcbiAgICAgICAgICBpZiAobm9VbmlxdWVDaGVjaykge1xuICAgICAgICAgICAgY29uc29sZS50cmFjZShgVHJ5IHRvIHVuc2V0IGFuIGlkIFxcYCR7aWR9JydgKTtcbiAgICAgICAgICAgIGRlbGV0ZSByZWdpc3RyeVtpZF07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVHJ5IHRvIHVuc2V0IGFuIGlkIFxcYCR7aWR9JydgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGVsZXRlIHJlZ2lzdHJ5W2lkXTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChyZWdpc3RyeVtpZF0pIHtcbiAgICAgICAgaWYgKGVsICE9PSByZWdpc3RyeVtpZF0pIHtcbiAgICAgICAgICBpZiAobm9VbmlxdWVDaGVjaykge1xuICAgICAgICAgICAgY29uc29sZS50cmFjZShcbiAgICAgICAgICAgICAgYElkIFxcYCR7aWR9JyBpcyBhbHJlYWR5IHJlc2VydmVkIGZvciBcXCcke3JlZ2lzdHJ5W2lkXX0nYFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJlZ2lzdHJ5W2lkXSA9IGVsO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgIGBJZCBcXGAke2lkfScgaXMgYWxyZWFkeSByZXNlcnZlZCBmb3IgXFwnJHtyZWdpc3RyeVtpZF19J2BcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlZ2lzdHJ5W2lkXSA9IGVsO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWdpc3RyeVtpZF0gPSBlbDtcbiAgICAgIH1cbiAgICB9LFxuICAgIGZpbmRFbEJ5SWQoaWQpIHtcbiAgICAgIHJldHVybiByZWdpc3RyeVtpZF07XG4gICAgfSxcbiAgfTtcbn1cblxuLyoqXG4gKiBCb290c3RyYXAgYSBzY2VuZVxuICogQHBhcmFtIHNjZW5lT3JDYW52YXNcbiAqIEBwYXJhbSBwYXJhbTFcbiAqIEByZXR1cm5zXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBTY2VuZShcbiAgc2NlbmVPckNhbnZhczogQkFCWUxPTi5TY2VuZSB8IEhUTUxDYW52YXNFbGVtZW50IHwgbnVsbCxcbiAge1xuICAgIGNvbXBvbmVudHMsXG4gICAgY2hpbGRyZW4sXG4gIH06IHtcbiAgICBjb21wb25lbnRzPzogKFxuICAgICAgfCAoKHNjZW5lOiBCQUJZTE9OLlNjZW5lKSA9PiB2b2lkIHwgUHJvbWlzZTx2b2lkPilcbiAgICAgIHwgKChzY2VuZTogQkFCWUxPTi5TY2VuZSwgLi4uYXJncykgPT4gdm9pZCB8IFByb21pc2U8dm9pZD4pXG4gICAgICB8IFsoc2NlbmU6IEJBQllMT04uU2NlbmUsIC4uLmFyZ3MpID0+IHZvaWQgfCBQcm9taXNlPHZvaWQ+LCAuLi5hbnldXG4gICAgKVtdO1xuICAgIGNoaWxkcmVuPzogKChzY2VuZTogQkFCWUxPTi5TY2VuZSkgPT4gUHJvbWlzZTxJRW50aXR5PilbXTtcbiAgfVxuKTogUHJvbWlzZTxCQUJZTE9OLlNjZW5lPiB7XG4gIGxldCBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50O1xuICBsZXQgZW5naW5lOiBCQUJZTE9OLkVuZ2luZTtcbiAgbGV0IHNjZW5lOiBCQUJZTE9OLlNjZW5lO1xuXG4gIC8vIERvIHdlIG5lZWQgYSBkZWZhdWx0IHNjZW5lP1xuXG4gIGlmIChzY2VuZU9yQ2FudmFzIGluc3RhbmNlb2YgQkFCWUxPTi5TY2VuZSkge1xuICAgIHNjZW5lID0gc2NlbmVPckNhbnZhcztcbiAgICBlbmdpbmUgPSBzY2VuZS5nZXRFbmdpbmUoKTtcbiAgICBjYW52YXMgPSBlbmdpbmUuZ2V0UmVuZGVyaW5nQ2FudmFzKCk7XG4gIH0gZWxzZSB7XG4gICAgY2FudmFzID1cbiAgICAgIHNjZW5lT3JDYW52YXMgaW5zdGFuY2VvZiBIVE1MQ2FudmFzRWxlbWVudFxuICAgICAgICA/IHNjZW5lT3JDYW52YXNcbiAgICAgICAgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgIGNhbnZhcy5zdHlsZS5jc3NUZXh0ID0gXCJ3aWR0aDogMTAwJTsgaGVpZ2h0OiAxMDAlOyB0b3VjaC1hY3Rpb246IG5vbmU7XCI7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjYW52YXMpO1xuXG4gICAgZW5naW5lID0gbmV3IEJBQllMT04uRW5naW5lKGNhbnZhcywgdHJ1ZSwge1xuICAgICAgcHJlc2VydmVEcmF3aW5nQnVmZmVyOiB0cnVlLFxuICAgICAgc3RlbmNpbDogdHJ1ZSxcbiAgICAgIGRpc2FibGVXZWJHTDJTdXBwb3J0OiBmYWxzZSxcbiAgICB9KTtcblxuICAgIHNjZW5lID0gbmV3IEJBQllMT04uU2NlbmUoZW5naW5lKTtcbiAgfVxuXG4gIGZvciAoY29uc3QgY29tcG9uZW50IG9mIGNvbXBvbmVudHMgfHwgW10pIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShjb21wb25lbnQpKSB7XG4gICAgICBjb25zdCBbZm4sIC4uLmFyZ3NdID0gY29tcG9uZW50O1xuICAgICAgYXdhaXQgZm4oc2NlbmUsIC4uLmFyZ3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhd2FpdCBjb21wb25lbnQoc2NlbmUpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGNoaWxkRWxzID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgKGNoaWxkcmVuIHx8IFtdKS5tYXAoKGNoaWxkRm4pID0+IGNoaWxkRm4oc2NlbmUpKVxuICApO1xuXG4gIC8vIERvIHdlIG5lZWQgYSBkZWZhdWx0IGxpZ2h0P1xuICBsZXQgbGlnaHQgPSAoY2hpbGRFbHMuZmluZChcbiAgICAoZWwpID0+IGVsIGluc3RhbmNlb2YgQkFCWUxPTi5MaWdodFxuICApIGFzIHVua25vd24pIGFzIEJBQllMT04uTGlnaHQ7XG4gIGlmICghbGlnaHQpIHtcbiAgICBsaWdodCA9IENyZWF0ZURlZmF1bHRMaWdodChzY2VuZSk7XG4gIH1cblxuICAvLyBEbyB3ZSBuZWVkIGEgZGVmYXVsdCBjYW1lcmE/XG4gIGxldCBjYW1lcmEgPSAoY2hpbGRFbHMuZmluZChcbiAgICAoZWwpID0+IGVsIGluc3RhbmNlb2YgQkFCWUxPTi5DYW1lcmFcbiAgKSBhcyB1bmtub3duKSBhcyBCQUJZTE9OLkNhbWVyYTtcbiAgaWYgKCFjYW1lcmEpIHtcbiAgICBjYW1lcmEgPSBDcmVhdGVEZWZhdWx0Q2FtZXJhKHNjZW5lKTtcbiAgfVxuXG4gIGVuZ2luZS5ydW5SZW5kZXJMb29wKCgpID0+IHNjZW5lLnJlbmRlcigpKTtcblxuICByZXR1cm4gc2NlbmU7XG59XG5cbi8qKlxuICogRW50aXR5IGlzIGJhc2ljYWxseSBhIE1lc2ggb3IgYSBGZWF0dXJlIHRoYXQgaXRzIGJlaGF2aW9yIGNhbiBiZSBtb2RpZmllZCBieSBzb21lIGZ1bmN0aW9ucyAoQ29tcG9uZW50cylcbiAqIGFuZCBtYXkgaGF2ZSBjaGlsZHJlbiB0aGF0IGFyZSBhbHNvIEVudGl0aWVzXG4gKiBAcGFyYW0gZm5cbiAqIEBwYXJhbSBvcHQgIHsgY29tcG9uZW50cywgY2hpbGRyZW4gfVxuICogQHJldHVybnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIEVudGl0eShcbiAgZm46IChzY2VuZTogQkFCWUxPTi5TY2VuZSkgPT4gSUVudGl0eSB8IFByb21pc2U8SUVudGl0eT4sXG4gIHtcbiAgICBjb21wb25lbnRzLFxuICAgIGNoaWxkcmVuLFxuICB9OiB7XG4gICAgY29tcG9uZW50cz86IChcbiAgICAgIHwgKChlbDogSUVudGl0eSkgPT4gdm9pZCB8IFByb21pc2U8dm9pZD4pXG4gICAgICB8ICgoZWw6IElFbnRpdHksIC4uLmFyZ3MpID0+IHZvaWQgfCBQcm9taXNlPHZvaWQ+KVxuICAgICAgfCBbKGVsOiBJRW50aXR5LCAuLi5hcmdzKSA9PiB2b2lkIHwgUHJvbWlzZTx2b2lkPiwgLi4uYW55XVxuICAgIClbXTtcbiAgICBjaGlsZHJlbj86ICgoXG4gICAgICBzY2VuZTogQkFCWUxPTi5TY2VuZVxuICAgICkgPT4gUHJvbWlzZTxJRW50aXR5PiB8IFByb21pc2U8SUVudGl0eVtdPilbXTtcbiAgfSA9IHsgY29tcG9uZW50czogW10sIGNoaWxkcmVuOiBbXSB9XG4pIHtcbiAgcmV0dXJuIGFzeW5jIChzY2VuZTogQkFCWUxPTi5TY2VuZSkgPT4ge1xuICAgIGNvbnN0IGVsID0gYXdhaXQgZm4oc2NlbmUpO1xuXG4gICAgZm9yIChjb25zdCBjb21wb25lbnQgb2YgY29tcG9uZW50cyB8fCBbXSkge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoY29tcG9uZW50KSkge1xuICAgICAgICBjb25zdCBbZm4sIC4uLmFyZ3NdID0gY29tcG9uZW50O1xuICAgICAgICBhd2FpdCBmbihlbCwgLi4uYXJncyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhd2FpdCBjb21wb25lbnQoZWwpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoY29uc3QgY2hpbGRGbiBvZiBjaGlsZHJlbiB8fCBbXSkge1xuICAgICAgbGV0IGNoaWxkRWwgPSBhd2FpdCBjaGlsZEZuKHNjZW5lKTtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGNoaWxkRWwpKSB7XG4gICAgICAgIGZvciAoY29uc3QgYyBvZiBjaGlsZEVsKSB7XG4gICAgICAgICAgaWYgKCEoYyBpbnN0YW5jZW9mIEJBQllMT04uV2ViWFJEZWZhdWx0RXhwZXJpZW5jZSkpIHtcbiAgICAgICAgICAgIGMucGFyZW50ID0gZWwgYXMgYW55O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCEoY2hpbGRFbCBpbnN0YW5jZW9mIEJBQllMT04uV2ViWFJEZWZhdWx0RXhwZXJpZW5jZSkpIHtcbiAgICAgICAgICBjaGlsZEVsLnBhcmVudCA9IGVsIGFzIGFueTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChtb2R1bGUuaG90KSB7XG4gICAgICAoZWwgYXMgYW55KS5fX2hvdF9fZGF0YV9fID0geyBmbiwgY29tcG9uZW50cywgY2hpbGRyZW4gfTsgLy8gVE9ETyhRTCk6IGFyZ3VtZW50cyBpcyBub3Qgd29ya2luZyBoZXJlXG4gICAgfVxuXG4gICAgcmV0dXJuIGVsO1xuICB9O1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIGRlZmF1bHQgTGlnaHQgZm9yIGBzY2VuZWAgKGlmIG5vdCBleGlzdClcbiAqXG4gKiBBIGBDb21wb25lbnRgIGZvciBgc2NlbmVgXG4gKiBAcGFyYW0gc2NlbmVcbiAqIEByZXR1cm5zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBDcmVhdGVEZWZhdWx0TGlnaHQoc2NlbmU6IEJBQllMT04uU2NlbmUpIHtcbiAgLy8gVGhpcyBjcmVhdGVzIGEgbGlnaHQsIGFpbWluZyAwLDEsMCAtIHRvIHRoZSBza3kgKG5vbi1tZXNoKVxuICBjb25zdCBsaWdodCA9IG5ldyBCQUJZTE9OLkhlbWlzcGhlcmljTGlnaHQoXG4gICAgXCJsaWdodFwiLFxuICAgIG5ldyBCQUJZTE9OLlZlY3RvcjMoMCwgMSwgMCksXG4gICAgc2NlbmVcbiAgKTtcblxuICAvLyBEZWZhdWx0IGludGVuc2l0eSBpcyAxLiBMZXQncyBkaW0gdGhlIGxpZ2h0IGEgc21hbGwgYW1vdW50XG4gIGxpZ2h0LmludGVuc2l0eSA9IDAuNztcbiAgcmV0dXJuIGxpZ2h0O1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIGRlZmF1bHQgQ2FtZXJhIGZvciBgc2NlbmVgIChpZiBub3QgZXhpc3QpXG4gKlxuICogQSBgQ29tcG9uZW50YCBmb3IgYHNjZW5lYFxuICogQHBhcmFtIHNjZW5lXG4gKiBAcmV0dXJuc1xuICovXG5leHBvcnQgZnVuY3Rpb24gQ3JlYXRlRGVmYXVsdENhbWVyYShzY2VuZTogQkFCWUxPTi5TY2VuZSkge1xuICAvLyBUaGlzIGNyZWF0ZXMgYW5kIHBvc2l0aW9ucyBhIGZyZWUgY2FtZXJhIChub24tbWVzaClcbiAgY29uc3QgY2FtZXJhID0gbmV3IEJBQllMT04uRnJlZUNhbWVyYShcbiAgICBcImNhbWVyYVwiLFxuICAgIG5ldyBCQUJZTE9OLlZlY3RvcjMoMCwgNSwgLTEwKSxcbiAgICBzY2VuZVxuICApO1xuXG4gIC8vIFRoaXMgdGFyZ2V0cyB0aGUgY2FtZXJhIHRvIHNjZW5lIG9yaWdpblxuICBjYW1lcmEuc2V0VGFyZ2V0KEJBQllMT04uVmVjdG9yMy5aZXJvKCkpO1xuXG4gIC8vIFRoaXMgYXR0YWNoZXMgdGhlIGNhbWVyYSB0byB0aGUgY2FudmFzXG4gIGNhbWVyYS5hdHRhY2hDb250cm9sKHNjZW5lLmdldEVuZ2luZSgpLmdldFJlbmRlcmluZ0NhbnZhcygpLCB0cnVlKTtcbiAgcmV0dXJuIGNhbWVyYTtcbn1cbiIsIi8qKlxuICogQHBhY2thZ2VEb2N1bWVudGF0aW9uIFN1cGVyIFRpbnkgRm91bmRhdGlvbiBmb3IgQkFCWUxPTiwgc3RkbGliXG4gKiBAYXV0aG9yIFF1YW5nLUxpbmggTEVcbiAqL1xuXG4vLyBQaHlzaWNzXG5cbmltcG9ydCAqIGFzIEJBQllMT04gZnJvbSBcImJhYnlsb25qc1wiO1xuaW1wb3J0IHsgRW50aXR5LCBJRW50aXR5IH0gZnJvbSBcIi4vY29yZVwiO1xuXG4vKipcbiAqIENvbXBuZW50OiBFbmFibGUgcGh5c2ljcyBmb3IgYHNjZW5lJ1xuICogQHBhcmFtIHNjZW5lXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBlbmFibGVQaHlzaWNzKHNjZW5lOiBCQUJZTE9OLlNjZW5lKSB7XG4gIHNjZW5lLmVuYWJsZVBoeXNpY3MoXG4gICAgbmV3IEJBQllMT04uVmVjdG9yMygwLCAtOS44MSwgMCksXG4gICAgbmV3IEJBQllMT04uQW1tb0pTUGx1Z2luKClcbiAgKTtcbn1cblxuLyoqXG4gKiBDb21wb25lbnQ6IFdpdGggcGh5c2ljcyBlbmFibGVkIG9uIHNjZW5lLCBlbmFibGUgaXQgZm9yIG1lc2ggYGVsJ1xuICogQHBhcmFtIGVsXG4gKiBAcGFyYW0gbWFzc1xuICogQHBhcmFtIHJlc3RpdHV0aW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB3aXRoUGh5c2ljcyhcbiAgZWw6IEJBQllMT04uTWVzaCxcbiAgbWFzczogbnVtYmVyLFxuICByZXN0aXR1dGlvbjogbnVtYmVyXG4pIHtcbiAgY29uc3QgcGh5c2ljc0ltcG9zdG9yID0gbmV3IEJBQllMT04uUGh5c2ljc0ltcG9zdG9yKFxuICAgIGVsLFxuICAgIEJBQllMT04uUGh5c2ljc0ltcG9zdG9yLlNwaGVyZUltcG9zdG9yLFxuICAgIHsgbWFzcywgcmVzdGl0dXRpb24gfSxcbiAgICBlbC5nZXRTY2VuZSgpXG4gICk7XG4gIGVsLnBoeXNpY3NJbXBvc3RvciA9IHBoeXNpY3NJbXBvc3Rvcjtcbn1cblxuLy8gRGVidWdcblxuLyoqXG4gKiBDb21wb25lbnQ6IEVuYWJsZSBkZWJ1ZyBmb3Igc2NlbmVcbiAqIEBwYXJhbSBzY2VuZVxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZW5hYmxlRGVidWcoc2NlbmU6IEJBQllMT04uU2NlbmUpIHtcbiAgc2NlbmUuZGVidWdMYXllci5zaG93KCk7XG59XG5cbi8vIE1hdGVyaWFsXG5cbmV4cG9ydCBmdW5jdGlvbiB3aXRoUEJSTWF0QnlDb2xvcihlbDogQkFCWUxPTi5NZXNoLCBjb2xvcjogc3RyaW5nKSB7XG4gIGNvbnN0IG1hdCA9IG5ldyBCQUJZTE9OLlBCUk1hdGVyaWFsKFwiYmx1ZVwiLCBlbC5nZXRTY2VuZSgpKTtcbiAgbWF0LmFsYmVkb0NvbG9yID0gQkFCWUxPTi5Db2xvcjMuRnJvbUhleFN0cmluZyhjb2xvcik7XG4gIG1hdC5tZXRhbGxpYyA9IDAuOTk7XG4gIG1hdC5yb3VnaG5lc3MgPSAwLjAxO1xuICBlbC5tYXRlcmlhbCA9IG1hdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHdpdGhSZWRNYXQoZWw6IEJBQllMT04uTWVzaCkge1xuICByZXR1cm4gd2l0aFBCUk1hdEJ5Q29sb3IoZWwsIFwiI0VGMkQ1RVwiKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHdpdGhHcmVlbk1hdChlbDogQkFCWUxPTi5NZXNoKSB7XG4gIHJldHVybiB3aXRoUEJSTWF0QnlDb2xvcihlbCwgXCIjN0JDOEE0XCIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gd2l0aEJsdWVNYXQoZWw6IEJBQllMT04uTWVzaCkge1xuICByZXR1cm4gd2l0aFBCUk1hdEJ5Q29sb3IoZWwsIFwiIzRDQzNEOVwiKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHdpdGhZZWxsb3dNYXQoZWw6IEJBQllMT04uTWVzaCkge1xuICByZXR1cm4gd2l0aFBCUk1hdEJ5Q29sb3IoZWwsIFwiI0ZGQzY1RFwiKTtcbn1cblxuLy8gWFJcblxuLyoqXG4gKiBFbnRpdHk6IEFkZCBYUiBvbiBgc2NlbmUnXG4gKiBAcGFyYW0gc2NlbmVcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFhSKHNjZW5lKSB7XG4gIHJldHVybiBzY2VuZS5jcmVhdGVEZWZhdWx0WFJFeHBlcmllbmNlQXN5bmMoKTtcbn1cblxuLyoqXG4gKiBFbmFibGUgUG9pbnRlciBTZWxlY3Rpb25cbiAqXG4gKiBBIENvbXBvbmVudCBmb3IgYHhySGVscGVyYFxuICogQHBhcmFtIHhySGVscGVyXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3aXRoUG9pbnRlclNlbGVjdGlvbihcbiAgeHJIZWxwZXI6IEJBQllMT04uV2ViWFJEZWZhdWx0RXhwZXJpZW5jZVxuKSB7XG4gIGNvbnN0IGZlYXR1cmVzTWFuYWdlciA9IHhySGVscGVyLmJhc2VFeHBlcmllbmNlLmZlYXR1cmVzTWFuYWdlcjtcblxuICBmZWF0dXJlc01hbmFnZXIuZW5hYmxlRmVhdHVyZShcbiAgICBCQUJZTE9OLldlYlhSRmVhdHVyZU5hbWUuUE9JTlRFUl9TRUxFQ1RJT04sXG4gICAgXCJzdGFibGVcIixcbiAgICB7XG4gICAgICB4cklucHV0OiB4ckhlbHBlci5pbnB1dCxcbiAgICAgIGVuYWJsZVBvaW50ZXJTZWxlY3Rpb25PbkFsbENvbnRyb2xsZXJzOiB0cnVlLFxuICAgIH1cbiAgKTtcbn1cblxuLyoqXG4gKiBFbmFibGUgVGVsZXBvcnRhdGlvblxuICpcbiAqIEEgQ29tcG9uZW50IGZvciBgeHJIZWxwZXJgXG4gKiBAcGFyYW0geHJIZWxwZXJcbiAqIEBwYXJhbSBmbG9vcnNcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdpdGhUZWxlcG9ydGF0aW9uKFxuICB4ckhlbHBlcjogQkFCWUxPTi5XZWJYUkRlZmF1bHRFeHBlcmllbmNlLFxuICBmbG9vcnM6IEJBQllMT04uTWVzaFtdIHwgRnVuY3Rpb24gfCB1bmRlZmluZWRcbikge1xuICBjb25zdCBmZWF0dXJlc01hbmFnZXIgPSB4ckhlbHBlci5iYXNlRXhwZXJpZW5jZS5mZWF0dXJlc01hbmFnZXI7XG5cbiAgbGV0IGZsb29yTWVzaGVzOiBCQUJZTE9OLk1lc2hbXTtcblxuICBpZiAoZmxvb3JzIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICBmbG9vck1lc2hlcyA9IGZsb29ycygpO1xuICB9IGVsc2Uge1xuICAgIGlmICghZmxvb3JzIHx8IGZsb29ycy5sZW5ndGggPT09IDApIHtcbiAgICAgIGNvbnN0IHNjZW5lID0geHJIZWxwZXIuYmFzZUV4cGVyaWVuY2Uuc2Vzc2lvbk1hbmFnZXIuc2NlbmU7XG4gICAgICBjb25zdCBncm91bmQgPSBCQUJZTE9OLk1lc2hCdWlsZGVyLkNyZWF0ZUdyb3VuZChcbiAgICAgICAgXCJncm91bmRcIixcbiAgICAgICAge1xuICAgICAgICAgIHdpZHRoOiA0MDAsXG4gICAgICAgICAgaGVpZ2h0OiA0MDAsXG4gICAgICAgIH0sXG4gICAgICAgIHNjZW5lXG4gICAgICApO1xuICAgICAgZmxvb3JzID0gW2dyb3VuZF07XG4gICAgfVxuICAgIGZsb29yTWVzaGVzID0gZmxvb3JzO1xuICB9XG5cbiAgZmVhdHVyZXNNYW5hZ2VyLmVuYWJsZUZlYXR1cmUoXG4gICAgQkFCWUxPTi5XZWJYUkZlYXR1cmVOYW1lLlRFTEVQT1JUQVRJT04sXG4gICAgXCJzdGFibGVcIixcbiAgICB7XG4gICAgICB4cklucHV0OiB4ckhlbHBlci5pbnB1dCxcbiAgICAgIGZsb29yTWVzaGVzOiBmbG9vck1lc2hlcyxcbiAgICAgIHNuYXBQb3NpdGlvbnM6IFtdLFxuICAgIH1cbiAgKTtcbn1cblxuLyoqXG4gKiBFbmFibGUgaGFuZHRyYWNraW5nXG4gKlxuICogQSBDb21wb25lbnQgZm9yIGB4ckhlbHBlcmBcbiAqIEBwYXJhbSB4ckhlbHBlclxuICogQHBhcmFtIHNldEVsRm9ySWRcbiAqIEBwYXJhbSBsZWZ0SGFuZElkXG4gKiBAcGFyYW0gcmlnaHRIYW5kSWRcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdpdGhIYW5kVHJhY2tpbmcoXG4gIHhySGVscGVyOiBCQUJZTE9OLldlYlhSRGVmYXVsdEV4cGVyaWVuY2UsXG4gIHNldEVsRm9ySWQ6IEZ1bmN0aW9uLFxuICBsZWZ0SGFuZElkID0gXCJsZWZ0SGFuZFwiLFxuICByaWdodEhhbmRJZCA9IFwicmlnaHRIYW5kXCJcbikge1xuICBjb25zdCBmZWF0dXJlc01hbmFnZXIgPSB4ckhlbHBlci5iYXNlRXhwZXJpZW5jZS5mZWF0dXJlc01hbmFnZXI7XG5cbiAgY29uc3QgYXZhaWxhYmxlRmVhdHVyZXMgPSBCQUJZTE9OLldlYlhSRmVhdHVyZXNNYW5hZ2VyLkdldEF2YWlsYWJsZUZlYXR1cmVzKCk7XG5cbiAgaWYgKFxuICAgIGF2YWlsYWJsZUZlYXR1cmVzLmZpbmQoXG4gICAgICAoaXQpID0+IGl0ID09PSBCQUJZTE9OLldlYlhSRmVhdHVyZU5hbWUuSEFORF9UUkFDS0lOR1xuICAgIClcbiAgKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHhySGFuZEZlYXR1cmU6IEJBQllMT04uSVdlYlhSRmVhdHVyZSAmXG4gICAgICAgIGFueSA9IGZlYXR1cmVzTWFuYWdlci5lbmFibGVGZWF0dXJlKFxuICAgICAgICBCQUJZTE9OLldlYlhSRmVhdHVyZU5hbWUuSEFORF9UUkFDS0lORyxcbiAgICAgICAgXCJsYXRlc3RcIixcbiAgICAgICAge1xuICAgICAgICAgIHhySW5wdXQ6IHhySGVscGVyLmlucHV0LFxuICAgICAgICAgIGpvaW50TWVzaGVzOiB7XG4gICAgICAgICAgICBlbmFibGVQaHlzaWNzOiB0cnVlLFxuICAgICAgICAgICAgcGh5c2ljc1Byb3BzOiB7XG4gICAgICAgICAgICAgIGZyaWN0aW9uOiAwLjUsXG4gICAgICAgICAgICAgIHJlc3RpdHV0aW9uOiAwLjMsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH1cbiAgICAgICk7XG5cbiAgICAgIHhySGFuZEZlYXR1cmUub25IYW5kQWRkZWRPYnNlcnZhYmxlLmFkZCgoaGFuZCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkhBTkQgQURERURcIiwgaGFuZCk7XG5cbiAgICAgICAgaWYgKGhhbmQueHJDb250cm9sbGVyLmlucHV0U291cmNlLmhhbmRlZG5lc3MgPT09IFwibGVmdFwiKSB7XG4gICAgICAgICAgc2V0RWxGb3JJZChoYW5kLCBsZWZ0SGFuZElkKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaGFuZC54ckNvbnRyb2xsZXIuaW5wdXRTb3VyY2UuaGFuZGVkbmVzcyA9PT0gXCJyaWdodFwiKSB7XG4gICAgICAgICAgc2V0RWxGb3JJZChoYW5kLCByaWdodEhhbmRJZCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB4ckhhbmRGZWF0dXJlLm9uSGFuZFJlbW92ZWRPYnNlcnZhYmxlLmFkZCgoaGFuZCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkhBTkQgUkVNT1ZFRFwiLCBoYW5kKTtcblxuICAgICAgICBpZiAoaGFuZC54ckNvbnRyb2xsZXIuaW5wdXRTb3VyY2UuaGFuZGVkbmVzcyA9PT0gXCJsZWZ0XCIpIHtcbiAgICAgICAgICBzZXRFbEZvcklkKHVuZGVmaW5lZCwgbGVmdEhhbmRJZCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGhhbmQueHJDb250cm9sbGVyLmlucHV0U291cmNlLmhhbmRlZG5lc3MgPT09IFwicmlnaHRcIikge1xuICAgICAgICAgIHNldEVsRm9ySWQodW5kZWZpbmVkLCByaWdodEhhbmRJZCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGU6IHVua25vd24pIHtcbiAgICAgIGNvbnNvbGUubG9nKFwid2l0aEhhbmRUcmFja2luZ1wiLCBcIlVuYWJsZSB0byBlbmFibGUgaGFuZCB0cmFja2luZ1wiKTtcbiAgICB9XG4gIH1cbn1cblxuLy8gUGlja1xuXG4vKipcbiAqIENvbXBvbmVudDogQWN0aW9uIHdoZW4gdGhlIG1lc2ggaGFzIGJlZW4gcGljayAoYnV0IG5vdCBuZWNjZXNzYXJ5IHJlbGVhc2UpXG4gKiBAcGFyYW0gZWxcbiAqIEBwYXJhbSBzZXRFbEZvcklkXG4gKiBAcGFyYW0gY2JcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG9uUGlja2VkRG93bihcbiAgZWw6IEJBQllMT04uTWVzaCxcbiAgc2V0RWxGb3JJZDogRnVuY3Rpb24sXG4gIGNiOiBGdW5jdGlvblxuKSB7XG4gIGNvbnN0IHNjZW5lID0gZWwuZ2V0U2NlbmUoKTtcblxuICAvLyBGSVhNRShRTCk6IEhvdyB0byBjbGVhbnVwP1xuICBjb25zdCBvYnNlcnZlciA9IHNjZW5lLm9uUG9pbnRlck9ic2VydmFibGUuYWRkKChwb2ludGVySW5mbykgPT4ge1xuICAgIHN3aXRjaCAocG9pbnRlckluZm8udHlwZSkge1xuICAgICAgY2FzZSBCQUJZTE9OLlBvaW50ZXJFdmVudFR5cGVzLlBPSU5URVJET1dOOlxuICAgICAgICBpZiAocG9pbnRlckluZm8ucGlja0luZm8uaGl0KSB7XG4gICAgICAgICAgbGV0IHBpY2tlZE1lc2ggPSBwb2ludGVySW5mby5waWNrSW5mby5waWNrZWRNZXNoO1xuICAgICAgICAgIGxldCBwb2ludGVySWQgPSAocG9pbnRlckluZm8uZXZlbnQgYXMgYW55KS5wb2ludGVySWQ7XG4gICAgICAgICAgaWYgKHBpY2tlZE1lc2ggPT09IGVsKSB7XG4gICAgICAgICAgICBzZXRFbEZvcklkKHBvaW50ZXJJZCwgb2JzZXJ2ZXIpO1xuICAgICAgICAgICAgY2IocG9pbnRlckluZm8pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH0pO1xufVxuXG4vKipcbiAqIENvbXBvbmVudDogQWN0aW9uIHdoZW4gbWVzaCBoYXMgYmVlbiByZWxlYXNlLCBzaG91bGQgd29yayBvbmx5IHdoZW4gYG9uUGlja2VkRG93bmAgaXMgYWxzbyBzZXRcbiAqIEBwYXJhbSBlbFxuICogQHBhcmFtIGZpbmRFbEJ5SWRcbiAqIEBwYXJhbSBjYlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gb25QaWNrZWRVcChcbiAgZWw6IEJBQllMT04uTWVzaCxcbiAgZmluZEVsQnlJZDogRnVuY3Rpb24sXG4gIGNiOiBGdW5jdGlvblxuKSB7XG4gIGNvbnN0IHNjZW5lID0gZWwuZ2V0U2NlbmUoKTtcblxuICAvLyBGSVhNRShRTCk6IEhvdyB0byBjbGVhbnVwP1xuICBjb25zdCBvYnNlcnZlciA9IHNjZW5lLm9uUG9pbnRlck9ic2VydmFibGUuYWRkKChwb2ludGVySW5mbykgPT4ge1xuICAgIHN3aXRjaCAocG9pbnRlckluZm8udHlwZSkge1xuICAgICAgY2FzZSBCQUJZTE9OLlBvaW50ZXJFdmVudFR5cGVzLlBPSU5URVJVUDpcbiAgICAgICAgbGV0IHBvaW50ZXJJZCA9IChwb2ludGVySW5mby5ldmVudCBhcyBhbnkpLnBvaW50ZXJJZDtcbiAgICAgICAgaWYgKGZpbmRFbEJ5SWQocG9pbnRlcklkKSkge1xuICAgICAgICAgIGNiKHBvaW50ZXJJZCk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9KTtcbn1cblxuLy8gSE1SOiBSZXBsYWNlIEVudGl0eVxuXG4vKipcbiAqIFJlcGxhY2UgYW4gZW50aXR5IHdpdGggYSBuZXcgYGZuYCwgd2hpbGUgcHJlc2V2ZSB0aGUgYGNvbXBvbmVudHNgIGFuZCBgY2hpbGRyZW5gXG4gKlxuICogT25seSB3b3JrIHdpdGggSE1SIGVuYWJsZWQgKG9yIGBtb2R1bGUuaG90YCBpcyB0cnV0aHkpXG4gKiBAcGFyYW0gZWxcbiAqIEByZXR1cm5zXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZXBsYWNlRW50aXR5KFxuICBlbDogSUVudGl0eSxcbiAgbmV3RWxGbjogKHNjZW5lOiBCQUJZTE9OLlNjZW5lKSA9PiBJRW50aXR5IHwgUHJvbWlzZTxJRW50aXR5PlxuKSB7XG4gIGlmICghZWwpIHtcbiAgICBjb25zb2xlLnRyYWNlKFwicmVwbGFjZUVudGl0eVwiLCBcIkVudGl0eSBub3QgZm91bmRcIik7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxldCBzY2VuZTogQkFCWUxPTi5TY2VuZTtcbiAgaWYgKGVsIGluc3RhbmNlb2YgQkFCWUxPTi5XZWJYUkRlZmF1bHRFeHBlcmllbmNlKSB7XG4gICAgc2NlbmUgPSBlbC5iYXNlRXhwZXJpZW5jZS5jYW1lcmEuZ2V0U2NlbmUoKTtcbiAgfSBlbHNlIHtcbiAgICBzY2VuZSA9IGVsLmdldFNjZW5lKCk7XG4gIH1cbiAgY29uc3QgcGFyZW50ID0gKGVsIGFzIGFueSkucGFyZW50OyAvLyBJZiBpdCBleGlzdHNcbiAgY29uc3QgeyBmbjogXywgY29tcG9uZW50cywgY2hpbGRyZW4gfSA9IChlbCBhcyBhbnkpLl9faG90X19kYXRhX187XG4gIGlmICgoZWwgYXMgQkFCWUxPTi5NZXNoKS5waHlzaWNzSW1wb3N0b3IpIHtcbiAgICAoZWwgYXMgQkFCWUxPTi5NZXNoKS5waHlzaWNzSW1wb3N0b3IuZGlzcG9zZSgpO1xuICB9XG4gIGVsLmRpc3Bvc2UoKTtcblxuICBjb25zdCBuZXdFbCA9IGF3YWl0IEVudGl0eShuZXdFbEZuLCB7XG4gICAgY29tcG9uZW50cyxcbiAgICBjaGlsZHJlbixcbiAgfSkoc2NlbmUpO1xuICAobmV3RWwgYXMgYW55KS5wYXJlbnQgPSBwYXJlbnQ7XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IEJBQllMT047IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImRlY2xhcmUgZ2xvYmFsIHtcbiAgLyoqXG4gICAqIFdpbmRvdyB3aXRoIFNURkJcbiAgICovXG4gIGludGVyZmFjZSBXaW5kb3cge1xuICAgIFNURkI6IHtcbiAgICAgIC8vIGhvdyB0byBkZWNsYXJlIGFsbCB0aGUgZXhwb3J0IGhlcmVcbiAgICB9ICYgKChpbnRvPzogYW55KSA9PiB2b2lkKTtcbiAgfVxufVxuXG5pbXBvcnQgKiBhcyBjb3JlIGZyb20gXCIuL2NvcmVcIjtcbmltcG9ydCAqIGFzIHN0ZGxpYiBmcm9tIFwiLi9zdGRsaWJcIjtcblxuKCh3aW5kb3c6IFdpbmRvdykgPT4ge1xuICBjb25zdCBzYXZlZFNURkIgPSB3aW5kb3cuU1RGQjtcblxuICB3aW5kb3cuU1RGQiA9ICgoaW50bz86IGFueSkgPT4ge1xuICAgIGludG8gPSBpbnRvIHx8IHdpbmRvdztcbiAgICBPYmplY3QuYXNzaWduKGludG8sIGNvcmUpO1xuICAgIE9iamVjdC5hc3NpZ24oaW50bywgc3RkbGliKTtcblxuICAgIGlmIChzYXZlZFNURkIpIHtcbiAgICAgIHdpbmRvdy5TVEZCID0gc2F2ZWRTVEZCO1xuICAgIH1cbiAgfSkgYXMgYW55O1xuXG4gIE9iamVjdC5hc3NpZ24od2luZG93LlNURkIsIGNvcmUpO1xuICBPYmplY3QuYXNzaWduKHdpbmRvdy5TVEZCLCBzdGRsaWIpO1xufSkod2luZG93KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==