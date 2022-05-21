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
 * Components: Functions that take `entity' as its first argument,
 *   enhances, modifies its behavior in some ways
 * Entity: Node, Mesh, Feature etc..
 */

/**
 * Bootstrap a new system with a `registry'
 *
 * @param registry global state
 * @returns [setElForId, findElById]
 */
function System(registry) {
    return {
        setElForId(el, id) {
            if (registry[id] && registry[id] !== el) {
                throw new Error(`Id \`${id}' is already reserved for \'${registry[id]}'`);
            }
            else if (el === undefined) {
                delete registry[id];
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
 * @param param1
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
                    c.parent = el;
                }
            }
            else {
                childEl.parent = el;
            }
        }
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
/**
 * @packageDocumentation Super Tiny Foundation, stdlib
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
        const xrHandFeature = featuresManager.enableFeature(babylonjs__WEBPACK_IMPORTED_MODULE_0__.WebXRFeatureName.HAND_TRACKING, "latest", {
            xrInput: xrHelper.input,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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N0Q7Ozs7Ozs7Ozs7Ozs7QUNLK0I7QUFDSTtBQUVuQyxDQUFDLENBQUMsTUFBYyxFQUFFLEVBQUU7SUFDbEIsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztJQUU5QixNQUFNLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFVLEVBQUUsRUFBRTtRQUM1QixJQUFJLEdBQUcsSUFBSSxJQUFJLE1BQU0sQ0FBQztRQUN0QixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxrQ0FBSSxDQUFDLENBQUM7UUFDMUIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsb0NBQU0sQ0FBQyxDQUFDO1FBRTVCLElBQUksU0FBUyxFQUFFO1lBQ2IsTUFBTSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7U0FDekI7SUFDSCxDQUFDLENBQVEsQ0FBQztJQUVWLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxrQ0FBSSxDQUFDLENBQUM7SUFDakMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLG9DQUFNLENBQUMsQ0FBQztBQUNyQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3N0ZmIvLi9zcmMvY29yZS50cyIsIndlYnBhY2s6Ly9zdGZiLy4vc3JjL3N0ZGxpYi50cyIsIndlYnBhY2s6Ly9zdGZiL2V4dGVybmFsIHZhciBcIkJBQllMT05cIiIsIndlYnBhY2s6Ly9zdGZiL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3N0ZmIvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vc3RmYi93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vc3RmYi93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3N0ZmIvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9zdGZiLy4vc3JjL3N0ZmIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAcGFja2FnZURvY3VtZW50YXRpb24gU3VwZXIgVGlueSBGb3VuZGF0aW9uIGZvciBCQUJZTE9OLCBlbmFibGVzIEVDUyBwcmluY2lwbGUgb24gQkFCWUxPTiBzY2VuZXNcbiAqIEBhdXRob3IgUXVhbmctTGluaCBMRVxuICpcbiAqIFN5c3RlbTogR2xvYmFsIHN0YXRlXG4gKiBDb21wb25lbnRzOiBGdW5jdGlvbnMgdGhhdCB0YWtlIGBlbnRpdHknIGFzIGl0cyBmaXJzdCBhcmd1bWVudCxcbiAqICAgZW5oYW5jZXMsIG1vZGlmaWVzIGl0cyBiZWhhdmlvciBpbiBzb21lIHdheXNcbiAqIEVudGl0eTogTm9kZSwgTWVzaCwgRmVhdHVyZSBldGMuLlxuICovXG5cbmltcG9ydCAqIGFzIEJBQllMT04gZnJvbSAnYmFieWxvbmpzJztcblxuLyoqXG4gKiBCb290c3RyYXAgYSBuZXcgc3lzdGVtIHdpdGggYSBgcmVnaXN0cnknXG4gKlxuICogQHBhcmFtIHJlZ2lzdHJ5IGdsb2JhbCBzdGF0ZVxuICogQHJldHVybnMgW3NldEVsRm9ySWQsIGZpbmRFbEJ5SWRdXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBTeXN0ZW0ocmVnaXN0cnkpIHtcbiAgcmV0dXJuIHtcbiAgICBzZXRFbEZvcklkKGVsLCBpZCkge1xuICAgICAgaWYgKHJlZ2lzdHJ5W2lkXSAmJiByZWdpc3RyeVtpZF0gIT09IGVsKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgSWQgXFxgJHtpZH0nIGlzIGFscmVhZHkgcmVzZXJ2ZWQgZm9yIFxcJyR7cmVnaXN0cnlbaWRdfSdgXG4gICAgICAgICk7XG4gICAgICB9IGVsc2UgaWYgKGVsID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZGVsZXRlIHJlZ2lzdHJ5W2lkXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlZ2lzdHJ5W2lkXSA9IGVsO1xuICAgICAgfVxuICAgIH0sXG4gICAgZmluZEVsQnlJZChpZCkge1xuICAgICAgcmV0dXJuIHJlZ2lzdHJ5W2lkXTtcbiAgICB9LFxuICB9O1xufVxuXG4vKipcbiAqIEJvb3RzdHJhcCBhIHNjZW5lXG4gKiBAcGFyYW0gc2NlbmVPckNhbnZhcyBcbiAqIEBwYXJhbSBwYXJhbTEgXG4gKiBAcmV0dXJucyBcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFNjZW5lPFQgZXh0ZW5kcyBCQUJZTE9OLk5vZGU+KFxuICBzY2VuZU9yQ2FudmFzOiBCQUJZTE9OLlNjZW5lIHwgSFRNTENhbnZhc0VsZW1lbnQgfCBudWxsLFxuICB7XG4gICAgY29tcG9uZW50cyxcbiAgICBjaGlsZHJlbixcbiAgfToge1xuICAgIGNvbXBvbmVudHM/OiAoXG4gICAgICB8ICgoc2NlbmU6IEJBQllMT04uU2NlbmUpID0+IHZvaWQgfCBQcm9taXNlPHZvaWQ+KVxuICAgICAgfCAoKHNjZW5lOiBCQUJZTE9OLlNjZW5lLCAuLi5hcmdzKSA9PiB2b2lkIHwgUHJvbWlzZTx2b2lkPilcbiAgICAgIHwgW0Z1bmN0aW9uLCAuLi5hbnldXG4gICAgKVtdO1xuICAgIGNoaWxkcmVuPzogKChzY2VuZTogQkFCWUxPTi5TY2VuZSkgPT4gUHJvbWlzZTxUPilbXTtcbiAgfVxuKTogUHJvbWlzZTxCQUJZTE9OLlNjZW5lPiB7XG4gIGxldCBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50O1xuICBsZXQgZW5naW5lOiBCQUJZTE9OLkVuZ2luZTtcbiAgbGV0IHNjZW5lOiBCQUJZTE9OLlNjZW5lO1xuXG4gIC8vIERvIHdlIG5lZWQgYSBkZWZhdWx0IHNjZW5lP1xuXG4gIGlmIChzY2VuZU9yQ2FudmFzIGluc3RhbmNlb2YgQkFCWUxPTi5TY2VuZSkge1xuICAgIHNjZW5lID0gc2NlbmVPckNhbnZhcztcbiAgICBlbmdpbmUgPSBzY2VuZS5nZXRFbmdpbmUoKTtcbiAgICBjYW52YXMgPSBlbmdpbmUuZ2V0UmVuZGVyaW5nQ2FudmFzKCk7XG4gIH0gZWxzZSB7XG4gICAgY2FudmFzID1cbiAgICAgIHNjZW5lT3JDYW52YXMgaW5zdGFuY2VvZiBIVE1MQ2FudmFzRWxlbWVudFxuICAgICAgICA/IHNjZW5lT3JDYW52YXNcbiAgICAgICAgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgIGNhbnZhcy5zdHlsZS5jc3NUZXh0ID0gXCJ3aWR0aDogMTAwJTsgaGVpZ2h0OiAxMDAlOyB0b3VjaC1hY3Rpb246IG5vbmU7XCI7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjYW52YXMpO1xuXG4gICAgZW5naW5lID0gbmV3IEJBQllMT04uRW5naW5lKGNhbnZhcywgdHJ1ZSwge1xuICAgICAgcHJlc2VydmVEcmF3aW5nQnVmZmVyOiB0cnVlLFxuICAgICAgc3RlbmNpbDogdHJ1ZSxcbiAgICAgIGRpc2FibGVXZWJHTDJTdXBwb3J0OiBmYWxzZSxcbiAgICB9KTtcblxuICAgIHNjZW5lID0gbmV3IEJBQllMT04uU2NlbmUoZW5naW5lKTtcbiAgfVxuXG4gIGZvciAoY29uc3QgY29tcG9uZW50IG9mIGNvbXBvbmVudHMgfHwgW10pIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShjb21wb25lbnQpKSB7XG4gICAgICBjb25zdCBbZm4sIC4uLmFyZ3NdID0gY29tcG9uZW50O1xuICAgICAgYXdhaXQgZm4oc2NlbmUsIC4uLmFyZ3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhd2FpdCBjb21wb25lbnQoc2NlbmUpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGNoaWxkRWxzID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgKGNoaWxkcmVuIHx8IFtdKS5tYXAoKGNoaWxkRm4pID0+IGNoaWxkRm4oc2NlbmUpKVxuICApO1xuXG4gIC8vIERvIHdlIG5lZWQgYSBkZWZhdWx0IGxpZ2h0P1xuICBsZXQgbGlnaHQgPSBjaGlsZEVscy5maW5kKFxuICAgIChlbCkgPT4gZWwgaW5zdGFuY2VvZiBCQUJZTE9OLkxpZ2h0XG4gICkgYXMgQkFCWUxPTi5MaWdodDtcbiAgaWYgKCFsaWdodCkge1xuICAgIGxpZ2h0ID0gQ3JlYXRlRGVmYXVsdExpZ2h0KHNjZW5lKTtcbiAgfVxuXG4gIC8vIERvIHdlIG5lZWQgYSBkZWZhdWx0IGNhbWVyYT9cbiAgbGV0IGNhbWVyYSA9IGNoaWxkRWxzLmZpbmQoXG4gICAgKGVsKSA9PiBlbCBpbnN0YW5jZW9mIEJBQllMT04uQ2FtZXJhXG4gICkgYXMgQkFCWUxPTi5DYW1lcmE7XG4gIGlmICghY2FtZXJhKSB7XG4gICAgY2FtZXJhID0gQ3JlYXRlRGVmYXVsdENhbWVyYShzY2VuZSk7XG4gIH1cblxuICBlbmdpbmUucnVuUmVuZGVyTG9vcCgoKSA9PiBzY2VuZS5yZW5kZXIoKSk7XG5cbiAgcmV0dXJuIHNjZW5lO1xufVxuXG4vKipcbiAqIEVudGl0eSBpcyBiYXNpY2FsbHkgYSBNZXNoIG9yIGEgRmVhdHVyZSB0aGF0IGl0cyBiZWhhdmlvciBjYW4gYmUgbW9kaWZpZWQgYnkgc29tZSBmdW5jdGlvbnMgKENvbXBvbmVudHMpXG4gKiBhbmQgbWF5IGhhdmUgY2hpbGRyZW4gdGhhdCBhcmUgYWxzbyBFbnRpdGllc1xuICogQHBhcmFtIGZuIFxuICogQHBhcmFtIHBhcmFtMSBcbiAqIEByZXR1cm5zIFxuICovXG5leHBvcnQgZnVuY3Rpb24gRW50aXR5PFQ+KFxuICBmbjogKHNjZW5lOiBCQUJZTE9OLlNjZW5lKSA9PiBUIHwgUHJvbWlzZTxUPixcbiAge1xuICAgIGNvbXBvbmVudHMsXG4gICAgY2hpbGRyZW4sXG4gIH06IHtcbiAgICBjb21wb25lbnRzPzogKFxuICAgICAgfCAoKGVsOiBUKSA9PiB2b2lkIHwgUHJvbWlzZTx2b2lkPilcbiAgICAgIHwgKChlbDogVCwgLi4uYXJncykgPT4gdm9pZCB8IFByb21pc2U8dm9pZD4pXG4gICAgICB8IFsoZWw6IFQsIC4uLmFyZ3MpID0+IHZvaWQgfCBQcm9taXNlPHZvaWQ+LCAuLi5hbnldXG4gICAgKVtdO1xuICAgIGNoaWxkcmVuPzogKChzY2VuZTogQkFCWUxPTi5TY2VuZSkgPT4gUHJvbWlzZTxUICYgeyBwYXJlbnQ6IGFueSB9PilbXTsgLy8gc3VwZXIgb2YgVD9cbiAgfSA9IHsgY29tcG9uZW50czogW10sIGNoaWxkcmVuOiBbXSB9XG4pIHtcbiAgcmV0dXJuIGFzeW5jIChzY2VuZTogQkFCWUxPTi5TY2VuZSkgPT4ge1xuICAgIGNvbnN0IGVsID0gYXdhaXQgZm4oc2NlbmUpO1xuXG4gICAgZm9yIChjb25zdCBjb21wb25lbnQgb2YgY29tcG9uZW50cyB8fCBbXSkge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoY29tcG9uZW50KSkge1xuICAgICAgICBjb25zdCBbZm4sIC4uLmFyZ3NdID0gY29tcG9uZW50O1xuICAgICAgICBhd2FpdCBmbihlbCwgLi4uYXJncyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhd2FpdCBjb21wb25lbnQoZWwpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoY29uc3QgY2hpbGRGbiBvZiBjaGlsZHJlbiB8fCBbXSkge1xuICAgICAgbGV0IGNoaWxkRWwgPSBhd2FpdCBjaGlsZEZuKHNjZW5lKTtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGNoaWxkRWwpKSB7XG4gICAgICAgIGZvciAoY29uc3QgYyBvZiBjaGlsZEVsKSB7XG4gICAgICAgICAgYy5wYXJlbnQgPSBlbDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2hpbGRFbC5wYXJlbnQgPSBlbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZWw7XG4gIH07XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgZGVmYXVsdCBMaWdodCBmb3IgYHNjZW5lYCAoaWYgbm90IGV4aXN0KVxuICpcbiAqIEEgYENvbXBvbmVudGAgZm9yIGBzY2VuZWBcbiAqIEBwYXJhbSBzY2VuZVxuICogQHJldHVybnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIENyZWF0ZURlZmF1bHRMaWdodChzY2VuZTogQkFCWUxPTi5TY2VuZSkge1xuICAvLyBUaGlzIGNyZWF0ZXMgYSBsaWdodCwgYWltaW5nIDAsMSwwIC0gdG8gdGhlIHNreSAobm9uLW1lc2gpXG4gIGNvbnN0IGxpZ2h0ID0gbmV3IEJBQllMT04uSGVtaXNwaGVyaWNMaWdodChcbiAgICBcImxpZ2h0XCIsXG4gICAgbmV3IEJBQllMT04uVmVjdG9yMygwLCAxLCAwKSxcbiAgICBzY2VuZVxuICApO1xuXG4gIC8vIERlZmF1bHQgaW50ZW5zaXR5IGlzIDEuIExldCdzIGRpbSB0aGUgbGlnaHQgYSBzbWFsbCBhbW91bnRcbiAgbGlnaHQuaW50ZW5zaXR5ID0gMC43O1xuICByZXR1cm4gbGlnaHQ7XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgZGVmYXVsdCBDYW1lcmEgZm9yIGBzY2VuZWAgKGlmIG5vdCBleGlzdClcbiAqXG4gKiBBIGBDb21wb25lbnRgIGZvciBgc2NlbmVgXG4gKiBAcGFyYW0gc2NlbmVcbiAqIEByZXR1cm5zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBDcmVhdGVEZWZhdWx0Q2FtZXJhKHNjZW5lOiBCQUJZTE9OLlNjZW5lKSB7XG4gIC8vIFRoaXMgY3JlYXRlcyBhbmQgcG9zaXRpb25zIGEgZnJlZSBjYW1lcmEgKG5vbi1tZXNoKVxuICBjb25zdCBjYW1lcmEgPSBuZXcgQkFCWUxPTi5GcmVlQ2FtZXJhKFxuICAgIFwiY2FtZXJhXCIsXG4gICAgbmV3IEJBQllMT04uVmVjdG9yMygwLCA1LCAtMTApLFxuICAgIHNjZW5lXG4gICk7XG5cbiAgLy8gVGhpcyB0YXJnZXRzIHRoZSBjYW1lcmEgdG8gc2NlbmUgb3JpZ2luXG4gIGNhbWVyYS5zZXRUYXJnZXQoQkFCWUxPTi5WZWN0b3IzLlplcm8oKSk7XG5cbiAgLy8gVGhpcyBhdHRhY2hlcyB0aGUgY2FtZXJhIHRvIHRoZSBjYW52YXNcbiAgY2FtZXJhLmF0dGFjaENvbnRyb2woc2NlbmUuZ2V0RW5naW5lKCkuZ2V0UmVuZGVyaW5nQ2FudmFzKCksIHRydWUpO1xuICByZXR1cm4gY2FtZXJhO1xufVxuIiwiLyoqXG4gKiBAcGFja2FnZURvY3VtZW50YXRpb24gU3VwZXIgVGlueSBGb3VuZGF0aW9uLCBzdGRsaWJcbiAqIEBhdXRob3IgUXVhbmctTGluaCBMRVxuICovXG5cbi8vIFBoeXNpY3NcblxuaW1wb3J0ICogYXMgQkFCWUxPTiBmcm9tICdiYWJ5bG9uanMnO1xuaW1wb3J0IEFtbW8gZnJvbSAnYW1tb2pzLXR5cGVkJ1xuXG4vKipcbiAqIENvbXBuZW50OiBFbmFibGUgcGh5c2ljcyBmb3IgYHNjZW5lJ1xuICogQHBhcmFtIHNjZW5lXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBlbmFibGVQaHlzaWNzKHNjZW5lOiBCQUJZTE9OLlNjZW5lKSB7XG4gIHNjZW5lLmVuYWJsZVBoeXNpY3MoXG4gICAgbmV3IEJBQllMT04uVmVjdG9yMygwLCAtOS44MSwgMCksXG4gICAgbmV3IEJBQllMT04uQW1tb0pTUGx1Z2luKClcbiAgKTtcbn1cblxuLyoqXG4gKiBDb21wb25lbnQ6IFdpdGggcGh5c2ljcyBlbmFibGVkIG9uIHNjZW5lLCBlbmFibGUgaXQgZm9yIG1lc2ggYGVsJ1xuICogQHBhcmFtIGVsXG4gKiBAcGFyYW0gbWFzc1xuICogQHBhcmFtIHJlc3RpdHV0aW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB3aXRoUGh5c2ljcyhcbiAgZWw6IEJBQllMT04uTWVzaCxcbiAgbWFzczogbnVtYmVyLFxuICByZXN0aXR1dGlvbjogbnVtYmVyXG4pIHtcbiAgY29uc3QgcGh5c2ljc0ltcG9zdG9yID0gbmV3IEJBQllMT04uUGh5c2ljc0ltcG9zdG9yKFxuICAgIGVsLFxuICAgIEJBQllMT04uUGh5c2ljc0ltcG9zdG9yLlNwaGVyZUltcG9zdG9yLFxuICAgIHsgbWFzcywgcmVzdGl0dXRpb24gfSxcbiAgICBlbC5nZXRTY2VuZSgpXG4gICk7XG4gIGVsLnBoeXNpY3NJbXBvc3RvciA9IHBoeXNpY3NJbXBvc3Rvcjtcbn1cblxuLy8gRGVidWdcblxuLyoqXG4gKiBDb21wb25lbnQ6IEVuYWJsZSBkZWJ1ZyBmb3Igc2NlbmVcbiAqIEBwYXJhbSBzY2VuZVxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZW5hYmxlRGVidWcoc2NlbmU6IEJBQllMT04uU2NlbmUpIHtcbiAgc2NlbmUuZGVidWdMYXllci5zaG93KCk7XG59XG5cbi8vIE1hdGVyaWFsXG5cbmV4cG9ydCBmdW5jdGlvbiB3aXRoUEJSTWF0QnlDb2xvcihlbDogQkFCWUxPTi5NZXNoLCBjb2xvcjogc3RyaW5nKSB7XG4gIGNvbnN0IG1hdCA9IG5ldyBCQUJZTE9OLlBCUk1hdGVyaWFsKFwiYmx1ZVwiLCBlbC5nZXRTY2VuZSgpKTtcbiAgbWF0LmFsYmVkb0NvbG9yID0gQkFCWUxPTi5Db2xvcjMuRnJvbUhleFN0cmluZyhjb2xvcik7XG4gIG1hdC5tZXRhbGxpYyA9IDAuOTk7XG4gIG1hdC5yb3VnaG5lc3MgPSAwLjAxO1xuICBlbC5tYXRlcmlhbCA9IG1hdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHdpdGhSZWRNYXQoZWw6IEJBQllMT04uTWVzaCkge1xuICByZXR1cm4gd2l0aFBCUk1hdEJ5Q29sb3IoZWwsIFwiI0VGMkQ1RVwiKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHdpdGhHcmVlbk1hdChlbDogQkFCWUxPTi5NZXNoKSB7XG4gIHJldHVybiB3aXRoUEJSTWF0QnlDb2xvcihlbCwgXCIjN0JDOEE0XCIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gd2l0aEJsdWVNYXQoZWw6IEJBQllMT04uTWVzaCkge1xuICByZXR1cm4gd2l0aFBCUk1hdEJ5Q29sb3IoZWwsIFwiIzRDQzNEOVwiKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHdpdGhZZWxsb3dNYXQoZWw6IEJBQllMT04uTWVzaCkge1xuICByZXR1cm4gd2l0aFBCUk1hdEJ5Q29sb3IoZWwsIFwiI0ZGQzY1RFwiKTtcbn1cblxuLy8gWFJcblxuLyoqXG4gKiBFbnRpdHk6IEFkZCBYUiBvbiBgc2NlbmUnXG4gKiBAcGFyYW0gc2NlbmVcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFhSKHNjZW5lKSB7XG4gIHJldHVybiBzY2VuZS5jcmVhdGVEZWZhdWx0WFJFeHBlcmllbmNlQXN5bmMoKTtcbn1cblxuLyoqXG4gKiBFbmFibGUgUG9pbnRlciBTZWxlY3Rpb25cbiAqXG4gKiBBIENvbXBvbmVudCBmb3IgYHhySGVscGVyYFxuICogQHBhcmFtIHhySGVscGVyXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3aXRoUG9pbnRlclNlbGVjdGlvbihcbiAgeHJIZWxwZXI6IEJBQllMT04uV2ViWFJEZWZhdWx0RXhwZXJpZW5jZVxuKSB7XG4gIGNvbnN0IGZlYXR1cmVzTWFuYWdlciA9IHhySGVscGVyLmJhc2VFeHBlcmllbmNlLmZlYXR1cmVzTWFuYWdlcjtcblxuICBmZWF0dXJlc01hbmFnZXIuZW5hYmxlRmVhdHVyZShcbiAgICBCQUJZTE9OLldlYlhSRmVhdHVyZU5hbWUuUE9JTlRFUl9TRUxFQ1RJT04sXG4gICAgXCJzdGFibGVcIixcbiAgICB7XG4gICAgICB4cklucHV0OiB4ckhlbHBlci5pbnB1dCxcbiAgICAgIGVuYWJsZVBvaW50ZXJTZWxlY3Rpb25PbkFsbENvbnRyb2xsZXJzOiB0cnVlLFxuICAgIH1cbiAgKTtcbn1cblxuLyoqXG4gKiBFbmFibGUgVGVsZXBvcnRhdGlvblxuICpcbiAqIEEgQ29tcG9uZW50IGZvciBgeHJIZWxwZXJgXG4gKiBAcGFyYW0geHJIZWxwZXJcbiAqIEBwYXJhbSBmbG9vcnNcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdpdGhUZWxlcG9ydGF0aW9uKFxuICB4ckhlbHBlcjogQkFCWUxPTi5XZWJYUkRlZmF1bHRFeHBlcmllbmNlLFxuICBmbG9vcnM6IEJBQllMT04uTWVzaFtdIHwgRnVuY3Rpb24gfCB1bmRlZmluZWRcbikge1xuICBjb25zdCBmZWF0dXJlc01hbmFnZXIgPSB4ckhlbHBlci5iYXNlRXhwZXJpZW5jZS5mZWF0dXJlc01hbmFnZXI7XG5cbiAgbGV0IGZsb29yTWVzaGVzOiBCQUJZTE9OLk1lc2hbXTtcblxuICBpZiAoZmxvb3JzIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICBmbG9vck1lc2hlcyA9IGZsb29ycygpO1xuICB9IGVsc2Uge1xuICAgIGlmICghZmxvb3JzIHx8IGZsb29ycy5sZW5ndGggPT09IDApIHtcbiAgICAgIGNvbnN0IHNjZW5lID0geHJIZWxwZXIuYmFzZUV4cGVyaWVuY2Uuc2Vzc2lvbk1hbmFnZXIuc2NlbmU7XG4gICAgICBjb25zdCBncm91bmQgPSBCQUJZTE9OLk1lc2hCdWlsZGVyLkNyZWF0ZUdyb3VuZChcbiAgICAgICAgXCJncm91bmRcIixcbiAgICAgICAge1xuICAgICAgICAgIHdpZHRoOiA0MDAsXG4gICAgICAgICAgaGVpZ2h0OiA0MDAsXG4gICAgICAgIH0sXG4gICAgICAgIHNjZW5lXG4gICAgICApO1xuICAgICAgZmxvb3JzID0gW2dyb3VuZF07XG4gICAgfVxuICAgIGZsb29yTWVzaGVzID0gZmxvb3JzO1xuICB9XG5cbiAgZmVhdHVyZXNNYW5hZ2VyLmVuYWJsZUZlYXR1cmUoXG4gICAgQkFCWUxPTi5XZWJYUkZlYXR1cmVOYW1lLlRFTEVQT1JUQVRJT04sXG4gICAgXCJzdGFibGVcIixcbiAgICB7XG4gICAgICB4cklucHV0OiB4ckhlbHBlci5pbnB1dCxcbiAgICAgIGZsb29yTWVzaGVzOiBmbG9vck1lc2hlcyxcbiAgICAgIHNuYXBQb3NpdGlvbnM6IFtdLFxuICAgIH1cbiAgKTtcbn1cblxuLyoqXG4gKiBFbmFibGUgaGFuZHRyYWNraW5nXG4gKlxuICogQSBDb21wb25lbnQgZm9yIGB4ckhlbHBlcmBcbiAqIEBwYXJhbSB4ckhlbHBlclxuICogQHBhcmFtIHNldEVsRm9ySWRcbiAqIEBwYXJhbSBsZWZ0SGFuZElkXG4gKiBAcGFyYW0gcmlnaHRIYW5kSWRcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdpdGhIYW5kVHJhY2tpbmcoXG4gIHhySGVscGVyOiBCQUJZTE9OLldlYlhSRGVmYXVsdEV4cGVyaWVuY2UsXG4gIHNldEVsRm9ySWQ6IEZ1bmN0aW9uLFxuICBsZWZ0SGFuZElkID0gXCJsZWZ0SGFuZFwiLFxuICByaWdodEhhbmRJZCA9IFwicmlnaHRIYW5kXCJcbikge1xuICBjb25zdCBmZWF0dXJlc01hbmFnZXIgPSB4ckhlbHBlci5iYXNlRXhwZXJpZW5jZS5mZWF0dXJlc01hbmFnZXI7XG5cbiAgY29uc3QgYXZhaWxhYmxlRmVhdHVyZXMgPSBCQUJZTE9OLldlYlhSRmVhdHVyZXNNYW5hZ2VyLkdldEF2YWlsYWJsZUZlYXR1cmVzKCk7XG5cbiAgaWYgKFxuICAgIGF2YWlsYWJsZUZlYXR1cmVzLmZpbmQoXG4gICAgICAoaXQpID0+IGl0ID09PSBCQUJZTE9OLldlYlhSRmVhdHVyZU5hbWUuSEFORF9UUkFDS0lOR1xuICAgIClcbiAgKSB7XG4gICAgY29uc3QgeHJIYW5kRmVhdHVyZTogQkFCWUxPTi5JV2ViWFJGZWF0dXJlICYgYW55ID1cbiAgICAgIGZlYXR1cmVzTWFuYWdlci5lbmFibGVGZWF0dXJlKFxuICAgICAgICBCQUJZTE9OLldlYlhSRmVhdHVyZU5hbWUuSEFORF9UUkFDS0lORyxcbiAgICAgICAgXCJsYXRlc3RcIixcbiAgICAgICAge1xuICAgICAgICAgIHhySW5wdXQ6IHhySGVscGVyLmlucHV0LFxuICAgICAgICB9XG4gICAgICApO1xuXG4gICAgeHJIYW5kRmVhdHVyZS5vbkhhbmRBZGRlZE9ic2VydmFibGUuYWRkKChoYW5kKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhcIkhBTkQgQURERURcIiwgaGFuZCk7XG5cbiAgICAgIGlmIChoYW5kLnhyQ29udHJvbGxlci5pbnB1dFNvdXJjZS5oYW5kZWRuZXNzID09PSBcImxlZnRcIikge1xuICAgICAgICBzZXRFbEZvcklkKGhhbmQsIGxlZnRIYW5kSWQpO1xuICAgICAgfVxuICAgICAgaWYgKGhhbmQueHJDb250cm9sbGVyLmlucHV0U291cmNlLmhhbmRlZG5lc3MgPT09IFwicmlnaHRcIikge1xuICAgICAgICBzZXRFbEZvcklkKGhhbmQsIHJpZ2h0SGFuZElkKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHhySGFuZEZlYXR1cmUub25IYW5kUmVtb3ZlZE9ic2VydmFibGUuYWRkKChoYW5kKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhcIkhBTkQgUkVNT1ZFRFwiLCBoYW5kKTtcblxuICAgICAgaWYgKGhhbmQueHJDb250cm9sbGVyLmlucHV0U291cmNlLmhhbmRlZG5lc3MgPT09IFwibGVmdFwiKSB7XG4gICAgICAgIHNldEVsRm9ySWQodW5kZWZpbmVkLCBsZWZ0SGFuZElkKTtcbiAgICAgIH1cbiAgICAgIGlmIChoYW5kLnhyQ29udHJvbGxlci5pbnB1dFNvdXJjZS5oYW5kZWRuZXNzID09PSBcInJpZ2h0XCIpIHtcbiAgICAgICAgc2V0RWxGb3JJZCh1bmRlZmluZWQsIHJpZ2h0SGFuZElkKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG4vLyBQaWNrXG5cbi8qKlxuICogQ29tcG9uZW50OiBBY3Rpb24gd2hlbiB0aGUgbWVzaCBoYXMgYmVlbiBwaWNrIChidXQgbm90IG5lY2Nlc3NhcnkgcmVsZWFzZSlcbiAqIEBwYXJhbSBlbFxuICogQHBhcmFtIHNldEVsRm9ySWRcbiAqIEBwYXJhbSBjYlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gb25QaWNrZWREb3duKFxuICBlbDogQkFCWUxPTi5NZXNoLFxuICBzZXRFbEZvcklkOiBGdW5jdGlvbixcbiAgY2I6IEZ1bmN0aW9uXG4pIHtcbiAgY29uc3Qgc2NlbmUgPSBlbC5nZXRTY2VuZSgpO1xuXG4gIC8vIEZJWE1FKFFMKTogSG93IHRvIGNsZWFudXA/XG4gIGNvbnN0IG9ic2VydmVyID0gc2NlbmUub25Qb2ludGVyT2JzZXJ2YWJsZS5hZGQoKHBvaW50ZXJJbmZvKSA9PiB7XG4gICAgc3dpdGNoIChwb2ludGVySW5mby50eXBlKSB7XG4gICAgICBjYXNlIEJBQllMT04uUG9pbnRlckV2ZW50VHlwZXMuUE9JTlRFUkRPV046XG4gICAgICAgIGlmIChwb2ludGVySW5mby5waWNrSW5mby5oaXQpIHtcbiAgICAgICAgICBsZXQgcGlja2VkTWVzaCA9IHBvaW50ZXJJbmZvLnBpY2tJbmZvLnBpY2tlZE1lc2g7XG4gICAgICAgICAgbGV0IHBvaW50ZXJJZCA9IChwb2ludGVySW5mby5ldmVudCBhcyBhbnkpLnBvaW50ZXJJZDtcbiAgICAgICAgICBpZiAocGlja2VkTWVzaCA9PT0gZWwpIHtcbiAgICAgICAgICAgIHNldEVsRm9ySWQocG9pbnRlcklkLCBvYnNlcnZlcik7XG4gICAgICAgICAgICBjYihwb2ludGVySW5mbyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfSk7XG59XG5cbi8qKlxuICogQ29tcG9uZW50OiBBY3Rpb24gd2hlbiBtZXNoIGhhcyBiZWVuIHJlbGVhc2UsIHNob3VsZCB3b3JrIG9ubHkgd2hlbiBgb25QaWNrZWREb3duYCBpcyBhbHNvIHNldFxuICogQHBhcmFtIGVsXG4gKiBAcGFyYW0gZmluZEVsQnlJZFxuICogQHBhcmFtIGNiXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBvblBpY2tlZFVwKFxuICBlbDogQkFCWUxPTi5NZXNoLFxuICBmaW5kRWxCeUlkOiBGdW5jdGlvbixcbiAgY2I6IEZ1bmN0aW9uXG4pIHtcbiAgY29uc3Qgc2NlbmUgPSBlbC5nZXRTY2VuZSgpO1xuXG4gIC8vIEZJWE1FKFFMKTogSG93IHRvIGNsZWFudXA/XG4gIGNvbnN0IG9ic2VydmVyID0gc2NlbmUub25Qb2ludGVyT2JzZXJ2YWJsZS5hZGQoKHBvaW50ZXJJbmZvKSA9PiB7XG4gICAgc3dpdGNoIChwb2ludGVySW5mby50eXBlKSB7XG4gICAgICBjYXNlIEJBQllMT04uUG9pbnRlckV2ZW50VHlwZXMuUE9JTlRFUlVQOlxuICAgICAgICBsZXQgcG9pbnRlcklkID0gKHBvaW50ZXJJbmZvLmV2ZW50IGFzIGFueSkucG9pbnRlcklkO1xuICAgICAgICBpZiAoZmluZEVsQnlJZChwb2ludGVySWQpKSB7XG4gICAgICAgICAgY2IocG9pbnRlcklkKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH0pO1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBCQUJZTE9OOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJkZWNsYXJlIGdsb2JhbCB7XG4gIC8qKlxuICAgKiBXaW5kb3cgd2l0aCBTVEZCXG4gICAqL1xuICBpbnRlcmZhY2UgV2luZG93IHtcbiAgICBTVEZCOiB7XG4gICAgICAvLyBob3cgdG8gZGVjbGFyZSBhbGwgdGhlIGV4cG9ydCBoZXJlXG4gICAgfSAmICgoaW50bz86IGFueSkgPT4gdm9pZCk7XG4gIH1cbn1cblxuaW1wb3J0ICogYXMgY29yZSBmcm9tIFwiLi9jb3JlXCI7XG5pbXBvcnQgKiBhcyBzdGRsaWIgZnJvbSBcIi4vc3RkbGliXCI7XG5cbigod2luZG93OiBXaW5kb3cpID0+IHtcbiAgY29uc3Qgc2F2ZWRTVEZCID0gd2luZG93LlNURkI7XG5cbiAgd2luZG93LlNURkIgPSAoKGludG8/OiBhbnkpID0+IHtcbiAgICBpbnRvID0gaW50byB8fCB3aW5kb3c7XG4gICAgT2JqZWN0LmFzc2lnbihpbnRvLCBjb3JlKTtcbiAgICBPYmplY3QuYXNzaWduKGludG8sIHN0ZGxpYik7XG5cbiAgICBpZiAoc2F2ZWRTVEZCKSB7XG4gICAgICB3aW5kb3cuU1RGQiA9IHNhdmVkU1RGQjtcbiAgICB9XG4gIH0pIGFzIGFueTtcblxuICBPYmplY3QuYXNzaWduKHdpbmRvdy5TVEZCLCBjb3JlKTtcbiAgT2JqZWN0LmFzc2lnbih3aW5kb3cuU1RGQiwgc3RkbGliKTtcbn0pKHdpbmRvdyk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=