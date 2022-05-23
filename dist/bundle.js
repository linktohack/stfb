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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxvQ0FBTSxDQUFDLENBQUM7UUFFNUIsSUFBSSxTQUFTLEVBQUU7WUFDYixNQUFNLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztTQUN6QjtJQUNILENBQUMsQ0FBUSxDQUFDO0lBRVYsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLGtDQUFJLENBQUMsQ0FBQztJQUNqQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsb0NBQU0sQ0FBQyxDQUFDO0FBQ3JDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc3RmYi8uL3NyYy9jb3JlLnRzIiwid2VicGFjazovL3N0ZmIvLi9zcmMvc3RkbGliLnRzIiwid2VicGFjazovL3N0ZmIvZXh0ZXJuYWwgdmFyIFwiQkFCWUxPTlwiIiwid2VicGFjazovL3N0ZmIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vc3RmYi93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9zdGZiL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9zdGZiL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vc3RmYi93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3N0ZmIvLi9zcmMvc3RmYi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBwYWNrYWdlRG9jdW1lbnRhdGlvbiBTdXBlciBUaW55IEZvdW5kYXRpb24gZm9yIEJBQllMT04sIGVuYWJsZXMgRUNTIHByaW5jaXBsZSBvbiBCQUJZTE9OIHNjZW5lc1xuICogQGF1dGhvciBRdWFuZy1MaW5oIExFXG4gKlxuICogU3lzdGVtOiBHbG9iYWwgc3RhdGVcbiAqIENvbXBvbmVudDogRnVuY3Rpb24gdGhhdCB0YWtlcyBgZW50aXR5JyBhcyBpdHMgZmlyc3QgYXJndW1lbnQsXG4gKiAgIGVuaGFuY2VzLCBtb2RpZmllcyBpdHMgYmVoYXZpb3IgaW4gc29tZSB3YXlzXG4gKiBFbnRpdHk6IEZ1bmN0aW9uIHRoYXQgdGFrZSBgc2NlbmVgIGFzIGl0cyBzb2xlIGFyZ3VtZW50LFxuICogICByZXR1cm5zIE5vZGUsIE1lc2gsIEZlYXR1cmUgZXRjLi4uIHRoYXQgY2FuIGJlIGVuaGFuY2VkIGJ5IENvbXBvbmVudFxuICovXG5cbmltcG9ydCAqIGFzIEJBQllMT04gZnJvbSBcImJhYnlsb25qc1wiO1xuXG5leHBvcnQgdHlwZSBJRW50aXR5ID1cbiAgfCBCQUJZTE9OLk5vZGVcbiAgfCBCQUJZTE9OLkNhbWVyYVxuICB8IEJBQllMT04uV2ViWFJEZWZhdWx0RXhwZXJpZW5jZTtcblxuLyoqXG4gKiBCb290c3RyYXAgYSBuZXcgc3lzdGVtIHdpdGggYSBgcmVnaXN0cnknXG4gKlxuICogQHBhcmFtIHJlZ2lzdHJ5IGdsb2JhbCBzdGF0ZVxuICogQHBhcmFtIG9wdCBvcHRpb25hbCB7IG5vVW5pcXVlQ2hlY2s6IGZhbHNlIH1cbiAqIEByZXR1cm5zIHsgc2V0RWxGb3JJZCwgZmluZEVsQnlJZCB9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBTeXN0ZW0ocmVnaXN0cnksIG9wdD86IHsgbm9VbmlxdWVDaGVjazogYm9vbGVhbiB9KSB7XG4gIGNvbnN0IG5vVW5pcXVlQ2hlY2sgPSBvcHQ/Lm5vVW5pcXVlQ2hlY2sgPz8gZmFsc2U7XG4gIHJldHVybiB7XG4gICAgc2V0RWxGb3JJZChlbCwgaWQpIHtcbiAgICAgIGlmIChlbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmICghcmVnaXN0cnlbaWRdKSB7XG4gICAgICAgICAgaWYgKG5vVW5pcXVlQ2hlY2spIHtcbiAgICAgICAgICAgIGNvbnNvbGUudHJhY2UoYFRyeSB0byB1bnNldCBhbiBpZCBcXGAke2lkfScnYCk7XG4gICAgICAgICAgICBkZWxldGUgcmVnaXN0cnlbaWRdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFRyeSB0byB1bnNldCBhbiBpZCBcXGAke2lkfScnYCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRlbGV0ZSByZWdpc3RyeVtpZF07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAocmVnaXN0cnlbaWRdKSB7XG4gICAgICAgIGlmIChlbCAhPT0gcmVnaXN0cnlbaWRdKSB7XG4gICAgICAgICAgaWYgKG5vVW5pcXVlQ2hlY2spIHtcbiAgICAgICAgICAgIGNvbnNvbGUudHJhY2UoXG4gICAgICAgICAgICAgIGBJZCBcXGAke2lkfScgaXMgYWxyZWFkeSByZXNlcnZlZCBmb3IgXFwnJHtyZWdpc3RyeVtpZF19J2BcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZWdpc3RyeVtpZF0gPSBlbDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICBgSWQgXFxgJHtpZH0nIGlzIGFscmVhZHkgcmVzZXJ2ZWQgZm9yIFxcJyR7cmVnaXN0cnlbaWRdfSdgXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWdpc3RyeVtpZF0gPSBlbDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVnaXN0cnlbaWRdID0gZWw7XG4gICAgICB9XG4gICAgfSxcbiAgICBmaW5kRWxCeUlkKGlkKSB7XG4gICAgICByZXR1cm4gcmVnaXN0cnlbaWRdO1xuICAgIH0sXG4gIH07XG59XG5cbi8qKlxuICogQm9vdHN0cmFwIGEgc2NlbmVcbiAqIEBwYXJhbSBzY2VuZU9yQ2FudmFzXG4gKiBAcGFyYW0gcGFyYW0xXG4gKiBAcmV0dXJuc1xuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gU2NlbmUoXG4gIHNjZW5lT3JDYW52YXM6IEJBQllMT04uU2NlbmUgfCBIVE1MQ2FudmFzRWxlbWVudCB8IG51bGwsXG4gIHtcbiAgICBjb21wb25lbnRzLFxuICAgIGNoaWxkcmVuLFxuICB9OiB7XG4gICAgY29tcG9uZW50cz86IChcbiAgICAgIHwgKChzY2VuZTogQkFCWUxPTi5TY2VuZSkgPT4gdm9pZCB8IFByb21pc2U8dm9pZD4pXG4gICAgICB8ICgoc2NlbmU6IEJBQllMT04uU2NlbmUsIC4uLmFyZ3MpID0+IHZvaWQgfCBQcm9taXNlPHZvaWQ+KVxuICAgICAgfCBbKHNjZW5lOiBCQUJZTE9OLlNjZW5lLCAuLi5hcmdzKSA9PiB2b2lkIHwgUHJvbWlzZTx2b2lkPiwgLi4uYW55XVxuICAgIClbXTtcbiAgICBjaGlsZHJlbj86ICgoc2NlbmU6IEJBQllMT04uU2NlbmUpID0+IFByb21pc2U8SUVudGl0eT4pW107XG4gIH1cbik6IFByb21pc2U8QkFCWUxPTi5TY2VuZT4ge1xuICBsZXQgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcbiAgbGV0IGVuZ2luZTogQkFCWUxPTi5FbmdpbmU7XG4gIGxldCBzY2VuZTogQkFCWUxPTi5TY2VuZTtcblxuICAvLyBEbyB3ZSBuZWVkIGEgZGVmYXVsdCBzY2VuZT9cblxuICBpZiAoc2NlbmVPckNhbnZhcyBpbnN0YW5jZW9mIEJBQllMT04uU2NlbmUpIHtcbiAgICBzY2VuZSA9IHNjZW5lT3JDYW52YXM7XG4gICAgZW5naW5lID0gc2NlbmUuZ2V0RW5naW5lKCk7XG4gICAgY2FudmFzID0gZW5naW5lLmdldFJlbmRlcmluZ0NhbnZhcygpO1xuICB9IGVsc2Uge1xuICAgIGNhbnZhcyA9XG4gICAgICBzY2VuZU9yQ2FudmFzIGluc3RhbmNlb2YgSFRNTENhbnZhc0VsZW1lbnRcbiAgICAgICAgPyBzY2VuZU9yQ2FudmFzXG4gICAgICAgIDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICBjYW52YXMuc3R5bGUuY3NzVGV4dCA9IFwid2lkdGg6IDEwMCU7IGhlaWdodDogMTAwJTsgdG91Y2gtYWN0aW9uOiBub25lO1wiO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY2FudmFzKTtcblxuICAgIGVuZ2luZSA9IG5ldyBCQUJZTE9OLkVuZ2luZShjYW52YXMsIHRydWUsIHtcbiAgICAgIHByZXNlcnZlRHJhd2luZ0J1ZmZlcjogdHJ1ZSxcbiAgICAgIHN0ZW5jaWw6IHRydWUsXG4gICAgICBkaXNhYmxlV2ViR0wyU3VwcG9ydDogZmFsc2UsXG4gICAgfSk7XG5cbiAgICBzY2VuZSA9IG5ldyBCQUJZTE9OLlNjZW5lKGVuZ2luZSk7XG4gIH1cblxuICBmb3IgKGNvbnN0IGNvbXBvbmVudCBvZiBjb21wb25lbnRzIHx8IFtdKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoY29tcG9uZW50KSkge1xuICAgICAgY29uc3QgW2ZuLCAuLi5hcmdzXSA9IGNvbXBvbmVudDtcbiAgICAgIGF3YWl0IGZuKHNjZW5lLCAuLi5hcmdzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXdhaXQgY29tcG9uZW50KHNjZW5lKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBjaGlsZEVscyA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgIChjaGlsZHJlbiB8fCBbXSkubWFwKChjaGlsZEZuKSA9PiBjaGlsZEZuKHNjZW5lKSlcbiAgKTtcblxuICAvLyBEbyB3ZSBuZWVkIGEgZGVmYXVsdCBsaWdodD9cbiAgbGV0IGxpZ2h0ID0gKGNoaWxkRWxzLmZpbmQoXG4gICAgKGVsKSA9PiBlbCBpbnN0YW5jZW9mIEJBQllMT04uTGlnaHRcbiAgKSBhcyB1bmtub3duKSBhcyBCQUJZTE9OLkxpZ2h0O1xuICBpZiAoIWxpZ2h0KSB7XG4gICAgbGlnaHQgPSBDcmVhdGVEZWZhdWx0TGlnaHQoc2NlbmUpO1xuICB9XG5cbiAgLy8gRG8gd2UgbmVlZCBhIGRlZmF1bHQgY2FtZXJhP1xuICBsZXQgY2FtZXJhID0gKGNoaWxkRWxzLmZpbmQoXG4gICAgKGVsKSA9PiBlbCBpbnN0YW5jZW9mIEJBQllMT04uQ2FtZXJhXG4gICkgYXMgdW5rbm93bikgYXMgQkFCWUxPTi5DYW1lcmE7XG4gIGlmICghY2FtZXJhKSB7XG4gICAgY2FtZXJhID0gQ3JlYXRlRGVmYXVsdENhbWVyYShzY2VuZSk7XG4gIH1cblxuICBlbmdpbmUucnVuUmVuZGVyTG9vcCgoKSA9PiBzY2VuZS5yZW5kZXIoKSk7XG5cbiAgcmV0dXJuIHNjZW5lO1xufVxuXG4vKipcbiAqIEVudGl0eSBpcyBiYXNpY2FsbHkgYSBNZXNoIG9yIGEgRmVhdHVyZSB0aGF0IGl0cyBiZWhhdmlvciBjYW4gYmUgbW9kaWZpZWQgYnkgc29tZSBmdW5jdGlvbnMgKENvbXBvbmVudHMpXG4gKiBhbmQgbWF5IGhhdmUgY2hpbGRyZW4gdGhhdCBhcmUgYWxzbyBFbnRpdGllc1xuICogQHBhcmFtIGZuXG4gKiBAcGFyYW0gb3B0ICB7IGNvbXBvbmVudHMsIGNoaWxkcmVuIH1cbiAqIEByZXR1cm5zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBFbnRpdHkoXG4gIGZuOiAoc2NlbmU6IEJBQllMT04uU2NlbmUpID0+IElFbnRpdHkgfCBQcm9taXNlPElFbnRpdHk+LFxuICB7XG4gICAgY29tcG9uZW50cyxcbiAgICBjaGlsZHJlbixcbiAgfToge1xuICAgIGNvbXBvbmVudHM/OiAoXG4gICAgICB8ICgoZWw6IElFbnRpdHkpID0+IHZvaWQgfCBQcm9taXNlPHZvaWQ+KVxuICAgICAgfCAoKGVsOiBJRW50aXR5LCAuLi5hcmdzKSA9PiB2b2lkIHwgUHJvbWlzZTx2b2lkPilcbiAgICAgIHwgWyhlbDogSUVudGl0eSwgLi4uYXJncykgPT4gdm9pZCB8IFByb21pc2U8dm9pZD4sIC4uLmFueV1cbiAgICApW107XG4gICAgY2hpbGRyZW4/OiAoKFxuICAgICAgc2NlbmU6IEJBQllMT04uU2NlbmVcbiAgICApID0+IFByb21pc2U8SUVudGl0eT4gfCBQcm9taXNlPElFbnRpdHlbXT4pW107XG4gIH0gPSB7IGNvbXBvbmVudHM6IFtdLCBjaGlsZHJlbjogW10gfVxuKSB7XG4gIHJldHVybiBhc3luYyAoc2NlbmU6IEJBQllMT04uU2NlbmUpID0+IHtcbiAgICBjb25zdCBlbCA9IGF3YWl0IGZuKHNjZW5lKTtcblxuICAgIGZvciAoY29uc3QgY29tcG9uZW50IG9mIGNvbXBvbmVudHMgfHwgW10pIHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGNvbXBvbmVudCkpIHtcbiAgICAgICAgY29uc3QgW2ZuLCAuLi5hcmdzXSA9IGNvbXBvbmVudDtcbiAgICAgICAgYXdhaXQgZm4oZWwsIC4uLmFyZ3MpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXdhaXQgY29tcG9uZW50KGVsKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGNoaWxkRm4gb2YgY2hpbGRyZW4gfHwgW10pIHtcbiAgICAgIGxldCBjaGlsZEVsID0gYXdhaXQgY2hpbGRGbihzY2VuZSk7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShjaGlsZEVsKSkge1xuICAgICAgICBmb3IgKGNvbnN0IGMgb2YgY2hpbGRFbCkge1xuICAgICAgICAgIGlmICghKGMgaW5zdGFuY2VvZiBCQUJZTE9OLldlYlhSRGVmYXVsdEV4cGVyaWVuY2UpKSB7XG4gICAgICAgICAgICBjLnBhcmVudCA9IGVsIGFzIGFueTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghKGNoaWxkRWwgaW5zdGFuY2VvZiBCQUJZTE9OLldlYlhSRGVmYXVsdEV4cGVyaWVuY2UpKSB7XG4gICAgICAgICAgY2hpbGRFbC5wYXJlbnQgPSBlbCBhcyBhbnk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobW9kdWxlLmhvdCkge1xuICAgICAgKGVsIGFzIGFueSkuX19ob3RfX2RhdGFfXyA9IHsgZm4sIGNvbXBvbmVudHMsIGNoaWxkcmVuIH07IC8vIFRPRE8oUUwpOiBhcmd1bWVudHMgaXMgbm90IHdvcmtpbmcgaGVyZVxuICAgIH1cblxuICAgIHJldHVybiBlbDtcbiAgfTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBkZWZhdWx0IExpZ2h0IGZvciBgc2NlbmVgIChpZiBub3QgZXhpc3QpXG4gKlxuICogQSBgQ29tcG9uZW50YCBmb3IgYHNjZW5lYFxuICogQHBhcmFtIHNjZW5lXG4gKiBAcmV0dXJuc1xuICovXG5leHBvcnQgZnVuY3Rpb24gQ3JlYXRlRGVmYXVsdExpZ2h0KHNjZW5lOiBCQUJZTE9OLlNjZW5lKSB7XG4gIC8vIFRoaXMgY3JlYXRlcyBhIGxpZ2h0LCBhaW1pbmcgMCwxLDAgLSB0byB0aGUgc2t5IChub24tbWVzaClcbiAgY29uc3QgbGlnaHQgPSBuZXcgQkFCWUxPTi5IZW1pc3BoZXJpY0xpZ2h0KFxuICAgIFwibGlnaHRcIixcbiAgICBuZXcgQkFCWUxPTi5WZWN0b3IzKDAsIDEsIDApLFxuICAgIHNjZW5lXG4gICk7XG5cbiAgLy8gRGVmYXVsdCBpbnRlbnNpdHkgaXMgMS4gTGV0J3MgZGltIHRoZSBsaWdodCBhIHNtYWxsIGFtb3VudFxuICBsaWdodC5pbnRlbnNpdHkgPSAwLjc7XG4gIHJldHVybiBsaWdodDtcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBkZWZhdWx0IENhbWVyYSBmb3IgYHNjZW5lYCAoaWYgbm90IGV4aXN0KVxuICpcbiAqIEEgYENvbXBvbmVudGAgZm9yIGBzY2VuZWBcbiAqIEBwYXJhbSBzY2VuZVxuICogQHJldHVybnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIENyZWF0ZURlZmF1bHRDYW1lcmEoc2NlbmU6IEJBQllMT04uU2NlbmUpIHtcbiAgLy8gVGhpcyBjcmVhdGVzIGFuZCBwb3NpdGlvbnMgYSBmcmVlIGNhbWVyYSAobm9uLW1lc2gpXG4gIGNvbnN0IGNhbWVyYSA9IG5ldyBCQUJZTE9OLkZyZWVDYW1lcmEoXG4gICAgXCJjYW1lcmFcIixcbiAgICBuZXcgQkFCWUxPTi5WZWN0b3IzKDAsIDUsIC0xMCksXG4gICAgc2NlbmVcbiAgKTtcblxuICAvLyBUaGlzIHRhcmdldHMgdGhlIGNhbWVyYSB0byBzY2VuZSBvcmlnaW5cbiAgY2FtZXJhLnNldFRhcmdldChCQUJZTE9OLlZlY3RvcjMuWmVybygpKTtcblxuICAvLyBUaGlzIGF0dGFjaGVzIHRoZSBjYW1lcmEgdG8gdGhlIGNhbnZhc1xuICBjYW1lcmEuYXR0YWNoQ29udHJvbChzY2VuZS5nZXRFbmdpbmUoKS5nZXRSZW5kZXJpbmdDYW52YXMoKSwgdHJ1ZSk7XG4gIHJldHVybiBjYW1lcmE7XG59XG4iLCIvKipcbiAqIEBwYWNrYWdlRG9jdW1lbnRhdGlvbiBTdXBlciBUaW55IEZvdW5kYXRpb24gZm9yIEJBQllMT04sIHN0ZGxpYlxuICogQGF1dGhvciBRdWFuZy1MaW5oIExFXG4gKi9cblxuLy8gUGh5c2ljc1xuXG5pbXBvcnQgKiBhcyBCQUJZTE9OIGZyb20gXCJiYWJ5bG9uanNcIjtcbmltcG9ydCB7IEVudGl0eSwgSUVudGl0eSB9IGZyb20gXCIuL2NvcmVcIjtcblxuLyoqXG4gKiBDb21wbmVudDogRW5hYmxlIHBoeXNpY3MgZm9yIGBzY2VuZSdcbiAqIEBwYXJhbSBzY2VuZVxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZW5hYmxlUGh5c2ljcyhzY2VuZTogQkFCWUxPTi5TY2VuZSkge1xuICBzY2VuZS5lbmFibGVQaHlzaWNzKFxuICAgIG5ldyBCQUJZTE9OLlZlY3RvcjMoMCwgLTkuODEsIDApLFxuICAgIG5ldyBCQUJZTE9OLkFtbW9KU1BsdWdpbigpXG4gICk7XG59XG5cbi8qKlxuICogQ29tcG9uZW50OiBXaXRoIHBoeXNpY3MgZW5hYmxlZCBvbiBzY2VuZSwgZW5hYmxlIGl0IGZvciBtZXNoIGBlbCdcbiAqIEBwYXJhbSBlbFxuICogQHBhcmFtIG1hc3NcbiAqIEBwYXJhbSByZXN0aXR1dGlvblxuICovXG5leHBvcnQgZnVuY3Rpb24gd2l0aFBoeXNpY3MoXG4gIGVsOiBCQUJZTE9OLk1lc2gsXG4gIG1hc3M6IG51bWJlcixcbiAgcmVzdGl0dXRpb246IG51bWJlclxuKSB7XG4gIGNvbnN0IHBoeXNpY3NJbXBvc3RvciA9IG5ldyBCQUJZTE9OLlBoeXNpY3NJbXBvc3RvcihcbiAgICBlbCxcbiAgICBCQUJZTE9OLlBoeXNpY3NJbXBvc3Rvci5TcGhlcmVJbXBvc3RvcixcbiAgICB7IG1hc3MsIHJlc3RpdHV0aW9uIH0sXG4gICAgZWwuZ2V0U2NlbmUoKVxuICApO1xuICBlbC5waHlzaWNzSW1wb3N0b3IgPSBwaHlzaWNzSW1wb3N0b3I7XG59XG5cbi8vIERlYnVnXG5cbi8qKlxuICogQ29tcG9uZW50OiBFbmFibGUgZGVidWcgZm9yIHNjZW5lXG4gKiBAcGFyYW0gc2NlbmVcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGVuYWJsZURlYnVnKHNjZW5lOiBCQUJZTE9OLlNjZW5lKSB7XG4gIHNjZW5lLmRlYnVnTGF5ZXIuc2hvdygpO1xufVxuXG4vLyBNYXRlcmlhbFxuXG5leHBvcnQgZnVuY3Rpb24gd2l0aFBCUk1hdEJ5Q29sb3IoZWw6IEJBQllMT04uTWVzaCwgY29sb3I6IHN0cmluZykge1xuICBjb25zdCBtYXQgPSBuZXcgQkFCWUxPTi5QQlJNYXRlcmlhbChcImJsdWVcIiwgZWwuZ2V0U2NlbmUoKSk7XG4gIG1hdC5hbGJlZG9Db2xvciA9IEJBQllMT04uQ29sb3IzLkZyb21IZXhTdHJpbmcoY29sb3IpO1xuICBtYXQubWV0YWxsaWMgPSAwLjk5O1xuICBtYXQucm91Z2huZXNzID0gMC4wMTtcbiAgZWwubWF0ZXJpYWwgPSBtYXQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3aXRoUmVkTWF0KGVsOiBCQUJZTE9OLk1lc2gpIHtcbiAgcmV0dXJuIHdpdGhQQlJNYXRCeUNvbG9yKGVsLCBcIiNFRjJENUVcIik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3aXRoR3JlZW5NYXQoZWw6IEJBQllMT04uTWVzaCkge1xuICByZXR1cm4gd2l0aFBCUk1hdEJ5Q29sb3IoZWwsIFwiIzdCQzhBNFwiKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHdpdGhCbHVlTWF0KGVsOiBCQUJZTE9OLk1lc2gpIHtcbiAgcmV0dXJuIHdpdGhQQlJNYXRCeUNvbG9yKGVsLCBcIiM0Q0MzRDlcIik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3aXRoWWVsbG93TWF0KGVsOiBCQUJZTE9OLk1lc2gpIHtcbiAgcmV0dXJuIHdpdGhQQlJNYXRCeUNvbG9yKGVsLCBcIiNGRkM2NURcIik7XG59XG5cbi8vIFhSXG5cbi8qKlxuICogRW50aXR5OiBBZGQgWFIgb24gYHNjZW5lJ1xuICogQHBhcmFtIHNjZW5lXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBYUihzY2VuZSkge1xuICByZXR1cm4gc2NlbmUuY3JlYXRlRGVmYXVsdFhSRXhwZXJpZW5jZUFzeW5jKCk7XG59XG5cbi8qKlxuICogRW5hYmxlIFBvaW50ZXIgU2VsZWN0aW9uXG4gKlxuICogQSBDb21wb25lbnQgZm9yIGB4ckhlbHBlcmBcbiAqIEBwYXJhbSB4ckhlbHBlclxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2l0aFBvaW50ZXJTZWxlY3Rpb24oXG4gIHhySGVscGVyOiBCQUJZTE9OLldlYlhSRGVmYXVsdEV4cGVyaWVuY2Vcbikge1xuICBjb25zdCBmZWF0dXJlc01hbmFnZXIgPSB4ckhlbHBlci5iYXNlRXhwZXJpZW5jZS5mZWF0dXJlc01hbmFnZXI7XG5cbiAgZmVhdHVyZXNNYW5hZ2VyLmVuYWJsZUZlYXR1cmUoXG4gICAgQkFCWUxPTi5XZWJYUkZlYXR1cmVOYW1lLlBPSU5URVJfU0VMRUNUSU9OLFxuICAgIFwic3RhYmxlXCIsXG4gICAge1xuICAgICAgeHJJbnB1dDogeHJIZWxwZXIuaW5wdXQsXG4gICAgICBlbmFibGVQb2ludGVyU2VsZWN0aW9uT25BbGxDb250cm9sbGVyczogdHJ1ZSxcbiAgICB9XG4gICk7XG59XG5cbi8qKlxuICogRW5hYmxlIFRlbGVwb3J0YXRpb25cbiAqXG4gKiBBIENvbXBvbmVudCBmb3IgYHhySGVscGVyYFxuICogQHBhcmFtIHhySGVscGVyXG4gKiBAcGFyYW0gZmxvb3JzXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3aXRoVGVsZXBvcnRhdGlvbihcbiAgeHJIZWxwZXI6IEJBQllMT04uV2ViWFJEZWZhdWx0RXhwZXJpZW5jZSxcbiAgZmxvb3JzOiBCQUJZTE9OLk1lc2hbXSB8IEZ1bmN0aW9uIHwgdW5kZWZpbmVkXG4pIHtcbiAgY29uc3QgZmVhdHVyZXNNYW5hZ2VyID0geHJIZWxwZXIuYmFzZUV4cGVyaWVuY2UuZmVhdHVyZXNNYW5hZ2VyO1xuXG4gIGxldCBmbG9vck1lc2hlczogQkFCWUxPTi5NZXNoW107XG5cbiAgaWYgKGZsb29ycyBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgZmxvb3JNZXNoZXMgPSBmbG9vcnMoKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoIWZsb29ycyB8fCBmbG9vcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICBjb25zdCBzY2VuZSA9IHhySGVscGVyLmJhc2VFeHBlcmllbmNlLnNlc3Npb25NYW5hZ2VyLnNjZW5lO1xuICAgICAgY29uc3QgZ3JvdW5kID0gQkFCWUxPTi5NZXNoQnVpbGRlci5DcmVhdGVHcm91bmQoXG4gICAgICAgIFwiZ3JvdW5kXCIsXG4gICAgICAgIHtcbiAgICAgICAgICB3aWR0aDogNDAwLFxuICAgICAgICAgIGhlaWdodDogNDAwLFxuICAgICAgICB9LFxuICAgICAgICBzY2VuZVxuICAgICAgKTtcbiAgICAgIGZsb29ycyA9IFtncm91bmRdO1xuICAgIH1cbiAgICBmbG9vck1lc2hlcyA9IGZsb29ycztcbiAgfVxuXG4gIGZlYXR1cmVzTWFuYWdlci5lbmFibGVGZWF0dXJlKFxuICAgIEJBQllMT04uV2ViWFJGZWF0dXJlTmFtZS5URUxFUE9SVEFUSU9OLFxuICAgIFwic3RhYmxlXCIsXG4gICAge1xuICAgICAgeHJJbnB1dDogeHJIZWxwZXIuaW5wdXQsXG4gICAgICBmbG9vck1lc2hlczogZmxvb3JNZXNoZXMsXG4gICAgICBzbmFwUG9zaXRpb25zOiBbXSxcbiAgICB9XG4gICk7XG59XG5cbi8qKlxuICogRW5hYmxlIGhhbmR0cmFja2luZ1xuICpcbiAqIEEgQ29tcG9uZW50IGZvciBgeHJIZWxwZXJgXG4gKiBAcGFyYW0geHJIZWxwZXJcbiAqIEBwYXJhbSBzZXRFbEZvcklkXG4gKiBAcGFyYW0gbGVmdEhhbmRJZFxuICogQHBhcmFtIHJpZ2h0SGFuZElkXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3aXRoSGFuZFRyYWNraW5nKFxuICB4ckhlbHBlcjogQkFCWUxPTi5XZWJYUkRlZmF1bHRFeHBlcmllbmNlLFxuICBzZXRFbEZvcklkOiBGdW5jdGlvbixcbiAgbGVmdEhhbmRJZCA9IFwibGVmdEhhbmRcIixcbiAgcmlnaHRIYW5kSWQgPSBcInJpZ2h0SGFuZFwiXG4pIHtcbiAgY29uc3QgZmVhdHVyZXNNYW5hZ2VyID0geHJIZWxwZXIuYmFzZUV4cGVyaWVuY2UuZmVhdHVyZXNNYW5hZ2VyO1xuXG4gIGNvbnN0IGF2YWlsYWJsZUZlYXR1cmVzID0gQkFCWUxPTi5XZWJYUkZlYXR1cmVzTWFuYWdlci5HZXRBdmFpbGFibGVGZWF0dXJlcygpO1xuXG4gIGlmIChcbiAgICBhdmFpbGFibGVGZWF0dXJlcy5maW5kKFxuICAgICAgKGl0KSA9PiBpdCA9PT0gQkFCWUxPTi5XZWJYUkZlYXR1cmVOYW1lLkhBTkRfVFJBQ0tJTkdcbiAgICApXG4gICkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB4ckhhbmRGZWF0dXJlOiBCQUJZTE9OLklXZWJYUkZlYXR1cmUgJlxuICAgICAgICBhbnkgPSBmZWF0dXJlc01hbmFnZXIuZW5hYmxlRmVhdHVyZShcbiAgICAgICAgQkFCWUxPTi5XZWJYUkZlYXR1cmVOYW1lLkhBTkRfVFJBQ0tJTkcsXG4gICAgICAgIFwibGF0ZXN0XCIsXG4gICAgICAgIHtcbiAgICAgICAgICB4cklucHV0OiB4ckhlbHBlci5pbnB1dCxcbiAgICAgICAgICBqb2ludE1lc2hlczoge1xuICAgICAgICAgICAgZW5hYmxlUGh5c2ljczogdHJ1ZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9XG4gICAgICApO1xuXG4gICAgICB4ckhhbmRGZWF0dXJlLm9uSGFuZEFkZGVkT2JzZXJ2YWJsZS5hZGQoKGhhbmQpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJIQU5EIEFEREVEXCIsIGhhbmQpO1xuXG4gICAgICAgIGlmIChoYW5kLnhyQ29udHJvbGxlci5pbnB1dFNvdXJjZS5oYW5kZWRuZXNzID09PSBcImxlZnRcIikge1xuICAgICAgICAgIHNldEVsRm9ySWQoaGFuZCwgbGVmdEhhbmRJZCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGhhbmQueHJDb250cm9sbGVyLmlucHV0U291cmNlLmhhbmRlZG5lc3MgPT09IFwicmlnaHRcIikge1xuICAgICAgICAgIHNldEVsRm9ySWQoaGFuZCwgcmlnaHRIYW5kSWQpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgeHJIYW5kRmVhdHVyZS5vbkhhbmRSZW1vdmVkT2JzZXJ2YWJsZS5hZGQoKGhhbmQpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJIQU5EIFJFTU9WRURcIiwgaGFuZCk7XG5cbiAgICAgICAgaWYgKGhhbmQueHJDb250cm9sbGVyLmlucHV0U291cmNlLmhhbmRlZG5lc3MgPT09IFwibGVmdFwiKSB7XG4gICAgICAgICAgc2V0RWxGb3JJZCh1bmRlZmluZWQsIGxlZnRIYW5kSWQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChoYW5kLnhyQ29udHJvbGxlci5pbnB1dFNvdXJjZS5oYW5kZWRuZXNzID09PSBcInJpZ2h0XCIpIHtcbiAgICAgICAgICBzZXRFbEZvcklkKHVuZGVmaW5lZCwgcmlnaHRIYW5kSWQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlOiB1bmtub3duKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIndpdGhIYW5kVHJhY2tpbmdcIiwgXCJVbmFibGUgdG8gZW5hYmxlIGhhbmQgdHJhY2tpbmdcIik7XG4gICAgfVxuICB9XG59XG5cbi8vIFBpY2tcblxuLyoqXG4gKiBDb21wb25lbnQ6IEFjdGlvbiB3aGVuIHRoZSBtZXNoIGhhcyBiZWVuIHBpY2sgKGJ1dCBub3QgbmVjY2Vzc2FyeSByZWxlYXNlKVxuICogQHBhcmFtIGVsXG4gKiBAcGFyYW0gc2V0RWxGb3JJZFxuICogQHBhcmFtIGNiXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBvblBpY2tlZERvd24oXG4gIGVsOiBCQUJZTE9OLk1lc2gsXG4gIHNldEVsRm9ySWQ6IEZ1bmN0aW9uLFxuICBjYjogRnVuY3Rpb25cbikge1xuICBjb25zdCBzY2VuZSA9IGVsLmdldFNjZW5lKCk7XG5cbiAgLy8gRklYTUUoUUwpOiBIb3cgdG8gY2xlYW51cD9cbiAgY29uc3Qgb2JzZXJ2ZXIgPSBzY2VuZS5vblBvaW50ZXJPYnNlcnZhYmxlLmFkZCgocG9pbnRlckluZm8pID0+IHtcbiAgICBzd2l0Y2ggKHBvaW50ZXJJbmZvLnR5cGUpIHtcbiAgICAgIGNhc2UgQkFCWUxPTi5Qb2ludGVyRXZlbnRUeXBlcy5QT0lOVEVSRE9XTjpcbiAgICAgICAgaWYgKHBvaW50ZXJJbmZvLnBpY2tJbmZvLmhpdCkge1xuICAgICAgICAgIGxldCBwaWNrZWRNZXNoID0gcG9pbnRlckluZm8ucGlja0luZm8ucGlja2VkTWVzaDtcbiAgICAgICAgICBsZXQgcG9pbnRlcklkID0gKHBvaW50ZXJJbmZvLmV2ZW50IGFzIGFueSkucG9pbnRlcklkO1xuICAgICAgICAgIGlmIChwaWNrZWRNZXNoID09PSBlbCkge1xuICAgICAgICAgICAgc2V0RWxGb3JJZChwb2ludGVySWQsIG9ic2VydmVyKTtcbiAgICAgICAgICAgIGNiKHBvaW50ZXJJbmZvKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9KTtcbn1cblxuLyoqXG4gKiBDb21wb25lbnQ6IEFjdGlvbiB3aGVuIG1lc2ggaGFzIGJlZW4gcmVsZWFzZSwgc2hvdWxkIHdvcmsgb25seSB3aGVuIGBvblBpY2tlZERvd25gIGlzIGFsc28gc2V0XG4gKiBAcGFyYW0gZWxcbiAqIEBwYXJhbSBmaW5kRWxCeUlkXG4gKiBAcGFyYW0gY2JcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG9uUGlja2VkVXAoXG4gIGVsOiBCQUJZTE9OLk1lc2gsXG4gIGZpbmRFbEJ5SWQ6IEZ1bmN0aW9uLFxuICBjYjogRnVuY3Rpb25cbikge1xuICBjb25zdCBzY2VuZSA9IGVsLmdldFNjZW5lKCk7XG5cbiAgLy8gRklYTUUoUUwpOiBIb3cgdG8gY2xlYW51cD9cbiAgY29uc3Qgb2JzZXJ2ZXIgPSBzY2VuZS5vblBvaW50ZXJPYnNlcnZhYmxlLmFkZCgocG9pbnRlckluZm8pID0+IHtcbiAgICBzd2l0Y2ggKHBvaW50ZXJJbmZvLnR5cGUpIHtcbiAgICAgIGNhc2UgQkFCWUxPTi5Qb2ludGVyRXZlbnRUeXBlcy5QT0lOVEVSVVA6XG4gICAgICAgIGxldCBwb2ludGVySWQgPSAocG9pbnRlckluZm8uZXZlbnQgYXMgYW55KS5wb2ludGVySWQ7XG4gICAgICAgIGlmIChmaW5kRWxCeUlkKHBvaW50ZXJJZCkpIHtcbiAgICAgICAgICBjYihwb2ludGVySWQpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfSk7XG59XG5cbi8vIEhNUjogUmVwbGFjZSBFbnRpdHlcblxuLyoqXG4gKiBSZXBsYWNlIGFuIGVudGl0eSB3aXRoIGEgbmV3IGBmbmAsIHdoaWxlIHByZXNldmUgdGhlIGBjb21wb25lbnRzYCBhbmQgYGNoaWxkcmVuYFxuICpcbiAqIE9ubHkgd29yayB3aXRoIEhNUiBlbmFibGVkIChvciBgbW9kdWxlLmhvdGAgaXMgdHJ1dGh5KVxuICogQHBhcmFtIGVsXG4gKiBAcmV0dXJuc1xuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVwbGFjZUVudGl0eShcbiAgZWw6IElFbnRpdHksXG4gIG5ld0VsRm46IChzY2VuZTogQkFCWUxPTi5TY2VuZSkgPT4gSUVudGl0eSB8IFByb21pc2U8SUVudGl0eT5cbikge1xuICBpZiAoIWVsKSB7XG4gICAgY29uc29sZS50cmFjZShcInJlcGxhY2VFbnRpdHlcIiwgXCJFbnRpdHkgbm90IGZvdW5kXCIpO1xuICAgIHJldHVybjtcbiAgfVxuICBsZXQgc2NlbmU6IEJBQllMT04uU2NlbmU7XG4gIGlmIChlbCBpbnN0YW5jZW9mIEJBQllMT04uV2ViWFJEZWZhdWx0RXhwZXJpZW5jZSkge1xuICAgIHNjZW5lID0gZWwuYmFzZUV4cGVyaWVuY2UuY2FtZXJhLmdldFNjZW5lKCk7XG4gIH0gZWxzZSB7XG4gICAgc2NlbmUgPSBlbC5nZXRTY2VuZSgpO1xuICB9XG4gIGNvbnN0IHBhcmVudCA9IChlbCBhcyBhbnkpLnBhcmVudDsgLy8gSWYgaXQgZXhpc3RzXG4gIGNvbnN0IHsgZm46IF8sIGNvbXBvbmVudHMsIGNoaWxkcmVuIH0gPSAoZWwgYXMgYW55KS5fX2hvdF9fZGF0YV9fO1xuICBpZiAoKGVsIGFzIEJBQllMT04uTWVzaCkucGh5c2ljc0ltcG9zdG9yKSB7XG4gICAgKGVsIGFzIEJBQllMT04uTWVzaCkucGh5c2ljc0ltcG9zdG9yLmRpc3Bvc2UoKTtcbiAgfVxuICBlbC5kaXNwb3NlKCk7XG5cbiAgY29uc3QgbmV3RWwgPSBhd2FpdCBFbnRpdHkobmV3RWxGbiwge1xuICAgIGNvbXBvbmVudHMsXG4gICAgY2hpbGRyZW4sXG4gIH0pKHNjZW5lKTtcbiAgKG5ld0VsIGFzIGFueSkucGFyZW50ID0gcGFyZW50O1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBCQUJZTE9OOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJkZWNsYXJlIGdsb2JhbCB7XG4gIC8qKlxuICAgKiBXaW5kb3cgd2l0aCBTVEZCXG4gICAqL1xuICBpbnRlcmZhY2UgV2luZG93IHtcbiAgICBTVEZCOiB7XG4gICAgICAvLyBob3cgdG8gZGVjbGFyZSBhbGwgdGhlIGV4cG9ydCBoZXJlXG4gICAgfSAmICgoaW50bz86IGFueSkgPT4gdm9pZCk7XG4gIH1cbn1cblxuaW1wb3J0ICogYXMgY29yZSBmcm9tIFwiLi9jb3JlXCI7XG5pbXBvcnQgKiBhcyBzdGRsaWIgZnJvbSBcIi4vc3RkbGliXCI7XG5cbigod2luZG93OiBXaW5kb3cpID0+IHtcbiAgY29uc3Qgc2F2ZWRTVEZCID0gd2luZG93LlNURkI7XG5cbiAgd2luZG93LlNURkIgPSAoKGludG8/OiBhbnkpID0+IHtcbiAgICBpbnRvID0gaW50byB8fCB3aW5kb3c7XG4gICAgT2JqZWN0LmFzc2lnbihpbnRvLCBjb3JlKTtcbiAgICBPYmplY3QuYXNzaWduKGludG8sIHN0ZGxpYik7XG5cbiAgICBpZiAoc2F2ZWRTVEZCKSB7XG4gICAgICB3aW5kb3cuU1RGQiA9IHNhdmVkU1RGQjtcbiAgICB9XG4gIH0pIGFzIGFueTtcblxuICBPYmplY3QuYXNzaWduKHdpbmRvdy5TVEZCLCBjb3JlKTtcbiAgT2JqZWN0LmFzc2lnbih3aW5kb3cuU1RGQiwgc3RkbGliKTtcbn0pKHdpbmRvdyk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=