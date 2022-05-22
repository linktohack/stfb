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
 * @param opt optional { noUniqueCheck: false }
 * @returns { setElForId, findElById }
 */
function System(registry, opt) {
    const noUniqueCheck = opt?.noUniqueCheck ?? false;
    return {
        setElForId(el, id) {
            if (registry[id] && registry[id] !== el) {
                if (noUniqueCheck) {
                    registry[id] = el;
                }
                else {
                    throw new Error(`Id \`${id}' is already reserved for \'${registry[id]}'`);
                }
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
/* harmony export */   "hotReplace": () => (/* binding */ hotReplace),
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
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./core */ "./src/core.ts");
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
/**
 * Create accept handler that replaces current entity with a new `fn`, while preseve the `components` and `children`
 * @param el
 * @returns
 */
function hotReplace(el, newElFn) {
    return () => {
        let scene;
        if (el instanceof babylonjs__WEBPACK_IMPORTED_MODULE_0__.WebXRDefaultExperience) {
            scene = el.baseExperience.camera.getScene();
        }
        else {
            scene = el.getScene();
        }
        const parent = el.parent;
        const { fn: _, components, children } = el.__hot__data__;
        el.dispose();
        (async () => {
            const newEl = await (0,_core__WEBPACK_IMPORTED_MODULE_1__.Entity)(newElFn, {
                components,
                children,
            })(scene);
            newEl.parent = parent;
        })();
    };
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7QUNLK0I7QUFDSTtBQUVuQyxDQUFDLENBQUMsTUFBYyxFQUFFLEVBQUU7SUFDbEIsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztJQUU5QixNQUFNLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFVLEVBQUUsRUFBRTtRQUM1QixJQUFJLEdBQUcsSUFBSSxJQUFJLE1BQU0sQ0FBQztRQUN0QixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxrQ0FBSSxDQUFDLENBQUM7UUFDMUIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsb0NBQU0sQ0FBQyxDQUFDO1FBRTVCLElBQUksU0FBUyxFQUFFO1lBQ2IsTUFBTSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7U0FDekI7SUFDSCxDQUFDLENBQVEsQ0FBQztJQUVWLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxrQ0FBSSxDQUFDLENBQUM7SUFDakMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLG9DQUFNLENBQUMsQ0FBQztBQUNyQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3N0ZmIvLi9zcmMvY29yZS50cyIsIndlYnBhY2s6Ly9zdGZiLy4vc3JjL3N0ZGxpYi50cyIsIndlYnBhY2s6Ly9zdGZiL2V4dGVybmFsIHZhciBcIkJBQllMT05cIiIsIndlYnBhY2s6Ly9zdGZiL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3N0ZmIvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vc3RmYi93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vc3RmYi93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3N0ZmIvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9zdGZiLy4vc3JjL3N0ZmIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAcGFja2FnZURvY3VtZW50YXRpb24gU3VwZXIgVGlueSBGb3VuZGF0aW9uIGZvciBCQUJZTE9OLCBlbmFibGVzIEVDUyBwcmluY2lwbGUgb24gQkFCWUxPTiBzY2VuZXNcbiAqIEBhdXRob3IgUXVhbmctTGluaCBMRVxuICpcbiAqIFN5c3RlbTogR2xvYmFsIHN0YXRlXG4gKiBDb21wb25lbnRzOiBGdW5jdGlvbnMgdGhhdCB0YWtlIGBlbnRpdHknIGFzIGl0cyBmaXJzdCBhcmd1bWVudCxcbiAqICAgZW5oYW5jZXMsIG1vZGlmaWVzIGl0cyBiZWhhdmlvciBpbiBzb21lIHdheXNcbiAqIEVudGl0eTogTm9kZSwgTWVzaCwgRmVhdHVyZSBldGMuLlxuICovXG5cbmltcG9ydCAqIGFzIEJBQllMT04gZnJvbSBcImJhYnlsb25qc1wiO1xuXG5leHBvcnQgdHlwZSBJRW50aXR5ID1cbiAgfCBCQUJZTE9OLk5vZGVcbiAgfCBCQUJZTE9OLkNhbWVyYVxuICB8IEJBQllMT04uV2ViWFJEZWZhdWx0RXhwZXJpZW5jZTtcblxuLyoqXG4gKiBCb290c3RyYXAgYSBuZXcgc3lzdGVtIHdpdGggYSBgcmVnaXN0cnknXG4gKlxuICogQHBhcmFtIHJlZ2lzdHJ5IGdsb2JhbCBzdGF0ZVxuICogQHBhcmFtIG9wdCBvcHRpb25hbCB7IG5vVW5pcXVlQ2hlY2s6IGZhbHNlIH1cbiAqIEByZXR1cm5zIHsgc2V0RWxGb3JJZCwgZmluZEVsQnlJZCB9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBTeXN0ZW0ocmVnaXN0cnksIG9wdD86IHsgbm9VbmlxdWVDaGVjazogYm9vbGVhbiB9KSB7XG4gIGNvbnN0IG5vVW5pcXVlQ2hlY2sgPSBvcHQ/Lm5vVW5pcXVlQ2hlY2sgPz8gZmFsc2U7XG4gIHJldHVybiB7XG4gICAgc2V0RWxGb3JJZChlbCwgaWQpIHtcbiAgICAgIGlmIChyZWdpc3RyeVtpZF0gJiYgcmVnaXN0cnlbaWRdICE9PSBlbCkge1xuICAgICAgICBpZiAobm9VbmlxdWVDaGVjaykge1xuICAgICAgICAgIHJlZ2lzdHJ5W2lkXSA9IGVsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgIGBJZCBcXGAke2lkfScgaXMgYWxyZWFkeSByZXNlcnZlZCBmb3IgXFwnJHtyZWdpc3RyeVtpZF19J2BcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGVsID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZGVsZXRlIHJlZ2lzdHJ5W2lkXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlZ2lzdHJ5W2lkXSA9IGVsO1xuICAgICAgfVxuICAgIH0sXG4gICAgZmluZEVsQnlJZChpZCkge1xuICAgICAgcmV0dXJuIHJlZ2lzdHJ5W2lkXTtcbiAgICB9LFxuICB9O1xufVxuXG4vKipcbiAqIEJvb3RzdHJhcCBhIHNjZW5lXG4gKiBAcGFyYW0gc2NlbmVPckNhbnZhc1xuICogQHBhcmFtIHBhcmFtMVxuICogQHJldHVybnNcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFNjZW5lKFxuICBzY2VuZU9yQ2FudmFzOiBCQUJZTE9OLlNjZW5lIHwgSFRNTENhbnZhc0VsZW1lbnQgfCBudWxsLFxuICB7XG4gICAgY29tcG9uZW50cyxcbiAgICBjaGlsZHJlbixcbiAgfToge1xuICAgIGNvbXBvbmVudHM/OiAoXG4gICAgICB8ICgoc2NlbmU6IEJBQllMT04uU2NlbmUpID0+IHZvaWQgfCBQcm9taXNlPHZvaWQ+KVxuICAgICAgfCAoKHNjZW5lOiBCQUJZTE9OLlNjZW5lLCAuLi5hcmdzKSA9PiB2b2lkIHwgUHJvbWlzZTx2b2lkPilcbiAgICAgIHwgW0Z1bmN0aW9uLCAuLi5hbnldXG4gICAgKVtdO1xuICAgIGNoaWxkcmVuPzogKChzY2VuZTogQkFCWUxPTi5TY2VuZSkgPT4gUHJvbWlzZTxJRW50aXR5PilbXTtcbiAgfVxuKTogUHJvbWlzZTxCQUJZTE9OLlNjZW5lPiB7XG4gIGxldCBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50O1xuICBsZXQgZW5naW5lOiBCQUJZTE9OLkVuZ2luZTtcbiAgbGV0IHNjZW5lOiBCQUJZTE9OLlNjZW5lO1xuXG4gIC8vIERvIHdlIG5lZWQgYSBkZWZhdWx0IHNjZW5lP1xuXG4gIGlmIChzY2VuZU9yQ2FudmFzIGluc3RhbmNlb2YgQkFCWUxPTi5TY2VuZSkge1xuICAgIHNjZW5lID0gc2NlbmVPckNhbnZhcztcbiAgICBlbmdpbmUgPSBzY2VuZS5nZXRFbmdpbmUoKTtcbiAgICBjYW52YXMgPSBlbmdpbmUuZ2V0UmVuZGVyaW5nQ2FudmFzKCk7XG4gIH0gZWxzZSB7XG4gICAgY2FudmFzID1cbiAgICAgIHNjZW5lT3JDYW52YXMgaW5zdGFuY2VvZiBIVE1MQ2FudmFzRWxlbWVudFxuICAgICAgICA/IHNjZW5lT3JDYW52YXNcbiAgICAgICAgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgIGNhbnZhcy5zdHlsZS5jc3NUZXh0ID0gXCJ3aWR0aDogMTAwJTsgaGVpZ2h0OiAxMDAlOyB0b3VjaC1hY3Rpb246IG5vbmU7XCI7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjYW52YXMpO1xuXG4gICAgZW5naW5lID0gbmV3IEJBQllMT04uRW5naW5lKGNhbnZhcywgdHJ1ZSwge1xuICAgICAgcHJlc2VydmVEcmF3aW5nQnVmZmVyOiB0cnVlLFxuICAgICAgc3RlbmNpbDogdHJ1ZSxcbiAgICAgIGRpc2FibGVXZWJHTDJTdXBwb3J0OiBmYWxzZSxcbiAgICB9KTtcblxuICAgIHNjZW5lID0gbmV3IEJBQllMT04uU2NlbmUoZW5naW5lKTtcbiAgfVxuXG4gIGZvciAoY29uc3QgY29tcG9uZW50IG9mIGNvbXBvbmVudHMgfHwgW10pIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShjb21wb25lbnQpKSB7XG4gICAgICBjb25zdCBbZm4sIC4uLmFyZ3NdID0gY29tcG9uZW50O1xuICAgICAgYXdhaXQgZm4oc2NlbmUsIC4uLmFyZ3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhd2FpdCBjb21wb25lbnQoc2NlbmUpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGNoaWxkRWxzID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgKGNoaWxkcmVuIHx8IFtdKS5tYXAoKGNoaWxkRm4pID0+IGNoaWxkRm4oc2NlbmUpKVxuICApO1xuXG4gIC8vIERvIHdlIG5lZWQgYSBkZWZhdWx0IGxpZ2h0P1xuICBsZXQgbGlnaHQgPSAoY2hpbGRFbHMuZmluZChcbiAgICAoZWwpID0+IGVsIGluc3RhbmNlb2YgQkFCWUxPTi5MaWdodFxuICApIGFzIHVua25vd24pIGFzIEJBQllMT04uTGlnaHQ7XG4gIGlmICghbGlnaHQpIHtcbiAgICBsaWdodCA9IENyZWF0ZURlZmF1bHRMaWdodChzY2VuZSk7XG4gIH1cblxuICAvLyBEbyB3ZSBuZWVkIGEgZGVmYXVsdCBjYW1lcmE/XG4gIGxldCBjYW1lcmEgPSAoY2hpbGRFbHMuZmluZChcbiAgICAoZWwpID0+IGVsIGluc3RhbmNlb2YgQkFCWUxPTi5DYW1lcmFcbiAgKSBhcyB1bmtub3duKSBhcyBCQUJZTE9OLkNhbWVyYTtcbiAgaWYgKCFjYW1lcmEpIHtcbiAgICBjYW1lcmEgPSBDcmVhdGVEZWZhdWx0Q2FtZXJhKHNjZW5lKTtcbiAgfVxuXG4gIGVuZ2luZS5ydW5SZW5kZXJMb29wKCgpID0+IHNjZW5lLnJlbmRlcigpKTtcblxuICByZXR1cm4gc2NlbmU7XG59XG5cbi8qKlxuICogRW50aXR5IGlzIGJhc2ljYWxseSBhIE1lc2ggb3IgYSBGZWF0dXJlIHRoYXQgaXRzIGJlaGF2aW9yIGNhbiBiZSBtb2RpZmllZCBieSBzb21lIGZ1bmN0aW9ucyAoQ29tcG9uZW50cylcbiAqIGFuZCBtYXkgaGF2ZSBjaGlsZHJlbiB0aGF0IGFyZSBhbHNvIEVudGl0aWVzXG4gKiBAcGFyYW0gZm5cbiAqIEBwYXJhbSBwYXJhbTFcbiAqIEByZXR1cm5zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBFbnRpdHkoXG4gIGZuOiAoc2NlbmU6IEJBQllMT04uU2NlbmUpID0+IElFbnRpdHkgfCBQcm9taXNlPElFbnRpdHk+LFxuICB7XG4gICAgY29tcG9uZW50cyxcbiAgICBjaGlsZHJlbixcbiAgfToge1xuICAgIGNvbXBvbmVudHM/OiAoXG4gICAgICB8ICgoZWw6IElFbnRpdHkpID0+IHZvaWQgfCBQcm9taXNlPHZvaWQ+KVxuICAgICAgfCAoKGVsOiBJRW50aXR5LCAuLi5hcmdzKSA9PiB2b2lkIHwgUHJvbWlzZTx2b2lkPilcbiAgICAgIHwgWyhlbDogSUVudGl0eSwgLi4uYXJncykgPT4gdm9pZCB8IFByb21pc2U8dm9pZD4sIC4uLmFueV1cbiAgICApW107XG4gICAgY2hpbGRyZW4/OiAoKHNjZW5lOiBCQUJZTE9OLlNjZW5lKSA9PiBQcm9taXNlPElFbnRpdHkgJiB7IHBhcmVudDogYW55IH0+KVtdOyAvLyBzdXBlciBvZiBUP1xuICB9ID0geyBjb21wb25lbnRzOiBbXSwgY2hpbGRyZW46IFtdIH1cbikge1xuICByZXR1cm4gYXN5bmMgKHNjZW5lOiBCQUJZTE9OLlNjZW5lKSA9PiB7XG4gICAgY29uc3QgZWwgPSBhd2FpdCBmbihzY2VuZSk7XG5cbiAgICBmb3IgKGNvbnN0IGNvbXBvbmVudCBvZiBjb21wb25lbnRzIHx8IFtdKSB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShjb21wb25lbnQpKSB7XG4gICAgICAgIGNvbnN0IFtmbiwgLi4uYXJnc10gPSBjb21wb25lbnQ7XG4gICAgICAgIGF3YWl0IGZuKGVsLCAuLi5hcmdzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGF3YWl0IGNvbXBvbmVudChlbCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBjaGlsZEZuIG9mIGNoaWxkcmVuIHx8IFtdKSB7XG4gICAgICBsZXQgY2hpbGRFbCA9IGF3YWl0IGNoaWxkRm4oc2NlbmUpO1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoY2hpbGRFbCkpIHtcbiAgICAgICAgZm9yIChjb25zdCBjIG9mIGNoaWxkRWwpIHtcbiAgICAgICAgICBjLnBhcmVudCA9IGVsO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjaGlsZEVsLnBhcmVudCA9IGVsO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChtb2R1bGUuaG90KSB7XG4gICAgICAoZWwgYXMgYW55KS5fX2hvdF9fZGF0YV9fID0geyBmbiwgY29tcG9uZW50cywgY2hpbGRyZW4gfTsgLy8gVE9ETzogYXJndW1lbnRzIGlzIG5vdCB3b3JraW5nIGhlcmVcbiAgICB9XG5cbiAgICByZXR1cm4gZWw7XG4gIH07XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgZGVmYXVsdCBMaWdodCBmb3IgYHNjZW5lYCAoaWYgbm90IGV4aXN0KVxuICpcbiAqIEEgYENvbXBvbmVudGAgZm9yIGBzY2VuZWBcbiAqIEBwYXJhbSBzY2VuZVxuICogQHJldHVybnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIENyZWF0ZURlZmF1bHRMaWdodChzY2VuZTogQkFCWUxPTi5TY2VuZSkge1xuICAvLyBUaGlzIGNyZWF0ZXMgYSBsaWdodCwgYWltaW5nIDAsMSwwIC0gdG8gdGhlIHNreSAobm9uLW1lc2gpXG4gIGNvbnN0IGxpZ2h0ID0gbmV3IEJBQllMT04uSGVtaXNwaGVyaWNMaWdodChcbiAgICBcImxpZ2h0XCIsXG4gICAgbmV3IEJBQllMT04uVmVjdG9yMygwLCAxLCAwKSxcbiAgICBzY2VuZVxuICApO1xuXG4gIC8vIERlZmF1bHQgaW50ZW5zaXR5IGlzIDEuIExldCdzIGRpbSB0aGUgbGlnaHQgYSBzbWFsbCBhbW91bnRcbiAgbGlnaHQuaW50ZW5zaXR5ID0gMC43O1xuICByZXR1cm4gbGlnaHQ7XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgZGVmYXVsdCBDYW1lcmEgZm9yIGBzY2VuZWAgKGlmIG5vdCBleGlzdClcbiAqXG4gKiBBIGBDb21wb25lbnRgIGZvciBgc2NlbmVgXG4gKiBAcGFyYW0gc2NlbmVcbiAqIEByZXR1cm5zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBDcmVhdGVEZWZhdWx0Q2FtZXJhKHNjZW5lOiBCQUJZTE9OLlNjZW5lKSB7XG4gIC8vIFRoaXMgY3JlYXRlcyBhbmQgcG9zaXRpb25zIGEgZnJlZSBjYW1lcmEgKG5vbi1tZXNoKVxuICBjb25zdCBjYW1lcmEgPSBuZXcgQkFCWUxPTi5GcmVlQ2FtZXJhKFxuICAgIFwiY2FtZXJhXCIsXG4gICAgbmV3IEJBQllMT04uVmVjdG9yMygwLCA1LCAtMTApLFxuICAgIHNjZW5lXG4gICk7XG5cbiAgLy8gVGhpcyB0YXJnZXRzIHRoZSBjYW1lcmEgdG8gc2NlbmUgb3JpZ2luXG4gIGNhbWVyYS5zZXRUYXJnZXQoQkFCWUxPTi5WZWN0b3IzLlplcm8oKSk7XG5cbiAgLy8gVGhpcyBhdHRhY2hlcyB0aGUgY2FtZXJhIHRvIHRoZSBjYW52YXNcbiAgY2FtZXJhLmF0dGFjaENvbnRyb2woc2NlbmUuZ2V0RW5naW5lKCkuZ2V0UmVuZGVyaW5nQ2FudmFzKCksIHRydWUpO1xuICByZXR1cm4gY2FtZXJhO1xufVxuIiwiLyoqXG4gKiBAcGFja2FnZURvY3VtZW50YXRpb24gU3VwZXIgVGlueSBGb3VuZGF0aW9uLCBzdGRsaWJcbiAqIEBhdXRob3IgUXVhbmctTGluaCBMRVxuICovXG5cbi8vIFBoeXNpY3NcblxuaW1wb3J0ICogYXMgQkFCWUxPTiBmcm9tIFwiYmFieWxvbmpzXCI7XG5pbXBvcnQgQW1tbyBmcm9tIFwiYW1tb2pzLXR5cGVkXCI7XG5pbXBvcnQgeyBFbnRpdHksIElFbnRpdHkgfSBmcm9tIFwiLi9jb3JlXCI7XG5cbi8qKlxuICogQ29tcG5lbnQ6IEVuYWJsZSBwaHlzaWNzIGZvciBgc2NlbmUnXG4gKiBAcGFyYW0gc2NlbmVcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGVuYWJsZVBoeXNpY3Moc2NlbmU6IEJBQllMT04uU2NlbmUpIHtcbiAgc2NlbmUuZW5hYmxlUGh5c2ljcyhcbiAgICBuZXcgQkFCWUxPTi5WZWN0b3IzKDAsIC05LjgxLCAwKSxcbiAgICBuZXcgQkFCWUxPTi5BbW1vSlNQbHVnaW4oKVxuICApO1xufVxuXG4vKipcbiAqIENvbXBvbmVudDogV2l0aCBwaHlzaWNzIGVuYWJsZWQgb24gc2NlbmUsIGVuYWJsZSBpdCBmb3IgbWVzaCBgZWwnXG4gKiBAcGFyYW0gZWxcbiAqIEBwYXJhbSBtYXNzXG4gKiBAcGFyYW0gcmVzdGl0dXRpb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHdpdGhQaHlzaWNzKFxuICBlbDogQkFCWUxPTi5NZXNoLFxuICBtYXNzOiBudW1iZXIsXG4gIHJlc3RpdHV0aW9uOiBudW1iZXJcbikge1xuICBjb25zdCBwaHlzaWNzSW1wb3N0b3IgPSBuZXcgQkFCWUxPTi5QaHlzaWNzSW1wb3N0b3IoXG4gICAgZWwsXG4gICAgQkFCWUxPTi5QaHlzaWNzSW1wb3N0b3IuU3BoZXJlSW1wb3N0b3IsXG4gICAgeyBtYXNzLCByZXN0aXR1dGlvbiB9LFxuICAgIGVsLmdldFNjZW5lKClcbiAgKTtcbiAgZWwucGh5c2ljc0ltcG9zdG9yID0gcGh5c2ljc0ltcG9zdG9yO1xufVxuXG4vLyBEZWJ1Z1xuXG4vKipcbiAqIENvbXBvbmVudDogRW5hYmxlIGRlYnVnIGZvciBzY2VuZVxuICogQHBhcmFtIHNjZW5lXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBlbmFibGVEZWJ1ZyhzY2VuZTogQkFCWUxPTi5TY2VuZSkge1xuICBzY2VuZS5kZWJ1Z0xheWVyLnNob3coKTtcbn1cblxuLy8gTWF0ZXJpYWxcblxuZXhwb3J0IGZ1bmN0aW9uIHdpdGhQQlJNYXRCeUNvbG9yKGVsOiBCQUJZTE9OLk1lc2gsIGNvbG9yOiBzdHJpbmcpIHtcbiAgY29uc3QgbWF0ID0gbmV3IEJBQllMT04uUEJSTWF0ZXJpYWwoXCJibHVlXCIsIGVsLmdldFNjZW5lKCkpO1xuICBtYXQuYWxiZWRvQ29sb3IgPSBCQUJZTE9OLkNvbG9yMy5Gcm9tSGV4U3RyaW5nKGNvbG9yKTtcbiAgbWF0Lm1ldGFsbGljID0gMC45OTtcbiAgbWF0LnJvdWdobmVzcyA9IDAuMDE7XG4gIGVsLm1hdGVyaWFsID0gbWF0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gd2l0aFJlZE1hdChlbDogQkFCWUxPTi5NZXNoKSB7XG4gIHJldHVybiB3aXRoUEJSTWF0QnlDb2xvcihlbCwgXCIjRUYyRDVFXCIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gd2l0aEdyZWVuTWF0KGVsOiBCQUJZTE9OLk1lc2gpIHtcbiAgcmV0dXJuIHdpdGhQQlJNYXRCeUNvbG9yKGVsLCBcIiM3QkM4QTRcIik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3aXRoQmx1ZU1hdChlbDogQkFCWUxPTi5NZXNoKSB7XG4gIHJldHVybiB3aXRoUEJSTWF0QnlDb2xvcihlbCwgXCIjNENDM0Q5XCIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gd2l0aFllbGxvd01hdChlbDogQkFCWUxPTi5NZXNoKSB7XG4gIHJldHVybiB3aXRoUEJSTWF0QnlDb2xvcihlbCwgXCIjRkZDNjVEXCIpO1xufVxuXG4vLyBYUlxuXG4vKipcbiAqIEVudGl0eTogQWRkIFhSIG9uIGBzY2VuZSdcbiAqIEBwYXJhbSBzY2VuZVxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gWFIoc2NlbmUpIHtcbiAgcmV0dXJuIHNjZW5lLmNyZWF0ZURlZmF1bHRYUkV4cGVyaWVuY2VBc3luYygpO1xufVxuXG4vKipcbiAqIEVuYWJsZSBQb2ludGVyIFNlbGVjdGlvblxuICpcbiAqIEEgQ29tcG9uZW50IGZvciBgeHJIZWxwZXJgXG4gKiBAcGFyYW0geHJIZWxwZXJcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdpdGhQb2ludGVyU2VsZWN0aW9uKFxuICB4ckhlbHBlcjogQkFCWUxPTi5XZWJYUkRlZmF1bHRFeHBlcmllbmNlXG4pIHtcbiAgY29uc3QgZmVhdHVyZXNNYW5hZ2VyID0geHJIZWxwZXIuYmFzZUV4cGVyaWVuY2UuZmVhdHVyZXNNYW5hZ2VyO1xuXG4gIGZlYXR1cmVzTWFuYWdlci5lbmFibGVGZWF0dXJlKFxuICAgIEJBQllMT04uV2ViWFJGZWF0dXJlTmFtZS5QT0lOVEVSX1NFTEVDVElPTixcbiAgICBcInN0YWJsZVwiLFxuICAgIHtcbiAgICAgIHhySW5wdXQ6IHhySGVscGVyLmlucHV0LFxuICAgICAgZW5hYmxlUG9pbnRlclNlbGVjdGlvbk9uQWxsQ29udHJvbGxlcnM6IHRydWUsXG4gICAgfVxuICApO1xufVxuXG4vKipcbiAqIEVuYWJsZSBUZWxlcG9ydGF0aW9uXG4gKlxuICogQSBDb21wb25lbnQgZm9yIGB4ckhlbHBlcmBcbiAqIEBwYXJhbSB4ckhlbHBlclxuICogQHBhcmFtIGZsb29yc1xuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2l0aFRlbGVwb3J0YXRpb24oXG4gIHhySGVscGVyOiBCQUJZTE9OLldlYlhSRGVmYXVsdEV4cGVyaWVuY2UsXG4gIGZsb29yczogQkFCWUxPTi5NZXNoW10gfCBGdW5jdGlvbiB8IHVuZGVmaW5lZFxuKSB7XG4gIGNvbnN0IGZlYXR1cmVzTWFuYWdlciA9IHhySGVscGVyLmJhc2VFeHBlcmllbmNlLmZlYXR1cmVzTWFuYWdlcjtcblxuICBsZXQgZmxvb3JNZXNoZXM6IEJBQllMT04uTWVzaFtdO1xuXG4gIGlmIChmbG9vcnMgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgIGZsb29yTWVzaGVzID0gZmxvb3JzKCk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKCFmbG9vcnMgfHwgZmxvb3JzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgY29uc3Qgc2NlbmUgPSB4ckhlbHBlci5iYXNlRXhwZXJpZW5jZS5zZXNzaW9uTWFuYWdlci5zY2VuZTtcbiAgICAgIGNvbnN0IGdyb3VuZCA9IEJBQllMT04uTWVzaEJ1aWxkZXIuQ3JlYXRlR3JvdW5kKFxuICAgICAgICBcImdyb3VuZFwiLFxuICAgICAgICB7XG4gICAgICAgICAgd2lkdGg6IDQwMCxcbiAgICAgICAgICBoZWlnaHQ6IDQwMCxcbiAgICAgICAgfSxcbiAgICAgICAgc2NlbmVcbiAgICAgICk7XG4gICAgICBmbG9vcnMgPSBbZ3JvdW5kXTtcbiAgICB9XG4gICAgZmxvb3JNZXNoZXMgPSBmbG9vcnM7XG4gIH1cblxuICBmZWF0dXJlc01hbmFnZXIuZW5hYmxlRmVhdHVyZShcbiAgICBCQUJZTE9OLldlYlhSRmVhdHVyZU5hbWUuVEVMRVBPUlRBVElPTixcbiAgICBcInN0YWJsZVwiLFxuICAgIHtcbiAgICAgIHhySW5wdXQ6IHhySGVscGVyLmlucHV0LFxuICAgICAgZmxvb3JNZXNoZXM6IGZsb29yTWVzaGVzLFxuICAgICAgc25hcFBvc2l0aW9uczogW10sXG4gICAgfVxuICApO1xufVxuXG4vKipcbiAqIEVuYWJsZSBoYW5kdHJhY2tpbmdcbiAqXG4gKiBBIENvbXBvbmVudCBmb3IgYHhySGVscGVyYFxuICogQHBhcmFtIHhySGVscGVyXG4gKiBAcGFyYW0gc2V0RWxGb3JJZFxuICogQHBhcmFtIGxlZnRIYW5kSWRcbiAqIEBwYXJhbSByaWdodEhhbmRJZFxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2l0aEhhbmRUcmFja2luZyhcbiAgeHJIZWxwZXI6IEJBQllMT04uV2ViWFJEZWZhdWx0RXhwZXJpZW5jZSxcbiAgc2V0RWxGb3JJZDogRnVuY3Rpb24sXG4gIGxlZnRIYW5kSWQgPSBcImxlZnRIYW5kXCIsXG4gIHJpZ2h0SGFuZElkID0gXCJyaWdodEhhbmRcIlxuKSB7XG4gIGNvbnN0IGZlYXR1cmVzTWFuYWdlciA9IHhySGVscGVyLmJhc2VFeHBlcmllbmNlLmZlYXR1cmVzTWFuYWdlcjtcblxuICBjb25zdCBhdmFpbGFibGVGZWF0dXJlcyA9IEJBQllMT04uV2ViWFJGZWF0dXJlc01hbmFnZXIuR2V0QXZhaWxhYmxlRmVhdHVyZXMoKTtcblxuICBpZiAoXG4gICAgYXZhaWxhYmxlRmVhdHVyZXMuZmluZChcbiAgICAgIChpdCkgPT4gaXQgPT09IEJBQllMT04uV2ViWFJGZWF0dXJlTmFtZS5IQU5EX1RSQUNLSU5HXG4gICAgKVxuICApIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgeHJIYW5kRmVhdHVyZTogQkFCWUxPTi5JV2ViWFJGZWF0dXJlICZcbiAgICAgICAgYW55ID0gZmVhdHVyZXNNYW5hZ2VyLmVuYWJsZUZlYXR1cmUoXG4gICAgICAgIEJBQllMT04uV2ViWFJGZWF0dXJlTmFtZS5IQU5EX1RSQUNLSU5HLFxuICAgICAgICBcImxhdGVzdFwiLFxuICAgICAgICB7XG4gICAgICAgICAgeHJJbnB1dDogeHJIZWxwZXIuaW5wdXQsXG4gICAgICAgICAgam9pbnRNZXNoZXM6IHtcbiAgICAgICAgICAgIGVuYWJsZVBoeXNpY3M6IHRydWUsXG4gICAgICAgICAgfSxcbiAgICAgICAgfVxuICAgICAgKTtcblxuICAgICAgeHJIYW5kRmVhdHVyZS5vbkhhbmRBZGRlZE9ic2VydmFibGUuYWRkKChoYW5kKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiSEFORCBBRERFRFwiLCBoYW5kKTtcblxuICAgICAgICBpZiAoaGFuZC54ckNvbnRyb2xsZXIuaW5wdXRTb3VyY2UuaGFuZGVkbmVzcyA9PT0gXCJsZWZ0XCIpIHtcbiAgICAgICAgICBzZXRFbEZvcklkKGhhbmQsIGxlZnRIYW5kSWQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChoYW5kLnhyQ29udHJvbGxlci5pbnB1dFNvdXJjZS5oYW5kZWRuZXNzID09PSBcInJpZ2h0XCIpIHtcbiAgICAgICAgICBzZXRFbEZvcklkKGhhbmQsIHJpZ2h0SGFuZElkKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHhySGFuZEZlYXR1cmUub25IYW5kUmVtb3ZlZE9ic2VydmFibGUuYWRkKChoYW5kKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiSEFORCBSRU1PVkVEXCIsIGhhbmQpO1xuXG4gICAgICAgIGlmIChoYW5kLnhyQ29udHJvbGxlci5pbnB1dFNvdXJjZS5oYW5kZWRuZXNzID09PSBcImxlZnRcIikge1xuICAgICAgICAgIHNldEVsRm9ySWQodW5kZWZpbmVkLCBsZWZ0SGFuZElkKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaGFuZC54ckNvbnRyb2xsZXIuaW5wdXRTb3VyY2UuaGFuZGVkbmVzcyA9PT0gXCJyaWdodFwiKSB7XG4gICAgICAgICAgc2V0RWxGb3JJZCh1bmRlZmluZWQsIHJpZ2h0SGFuZElkKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZTogdW5rbm93bikge1xuICAgICAgY29uc29sZS5sb2coXCJ3aXRoSGFuZFRyYWNraW5nXCIsIFwiVW5hYmxlIHRvIGVuYWJsZSBoYW5kIHRyYWNraW5nXCIpO1xuICAgIH1cbiAgfVxufVxuXG4vLyBQaWNrXG5cbi8qKlxuICogQ29tcG9uZW50OiBBY3Rpb24gd2hlbiB0aGUgbWVzaCBoYXMgYmVlbiBwaWNrIChidXQgbm90IG5lY2Nlc3NhcnkgcmVsZWFzZSlcbiAqIEBwYXJhbSBlbFxuICogQHBhcmFtIHNldEVsRm9ySWRcbiAqIEBwYXJhbSBjYlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gb25QaWNrZWREb3duKFxuICBlbDogQkFCWUxPTi5NZXNoLFxuICBzZXRFbEZvcklkOiBGdW5jdGlvbixcbiAgY2I6IEZ1bmN0aW9uXG4pIHtcbiAgY29uc3Qgc2NlbmUgPSBlbC5nZXRTY2VuZSgpO1xuXG4gIC8vIEZJWE1FKFFMKTogSG93IHRvIGNsZWFudXA/XG4gIGNvbnN0IG9ic2VydmVyID0gc2NlbmUub25Qb2ludGVyT2JzZXJ2YWJsZS5hZGQoKHBvaW50ZXJJbmZvKSA9PiB7XG4gICAgc3dpdGNoIChwb2ludGVySW5mby50eXBlKSB7XG4gICAgICBjYXNlIEJBQllMT04uUG9pbnRlckV2ZW50VHlwZXMuUE9JTlRFUkRPV046XG4gICAgICAgIGlmIChwb2ludGVySW5mby5waWNrSW5mby5oaXQpIHtcbiAgICAgICAgICBsZXQgcGlja2VkTWVzaCA9IHBvaW50ZXJJbmZvLnBpY2tJbmZvLnBpY2tlZE1lc2g7XG4gICAgICAgICAgbGV0IHBvaW50ZXJJZCA9IChwb2ludGVySW5mby5ldmVudCBhcyBhbnkpLnBvaW50ZXJJZDtcbiAgICAgICAgICBpZiAocGlja2VkTWVzaCA9PT0gZWwpIHtcbiAgICAgICAgICAgIHNldEVsRm9ySWQocG9pbnRlcklkLCBvYnNlcnZlcik7XG4gICAgICAgICAgICBjYihwb2ludGVySW5mbyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfSk7XG59XG5cbi8qKlxuICogQ29tcG9uZW50OiBBY3Rpb24gd2hlbiBtZXNoIGhhcyBiZWVuIHJlbGVhc2UsIHNob3VsZCB3b3JrIG9ubHkgd2hlbiBgb25QaWNrZWREb3duYCBpcyBhbHNvIHNldFxuICogQHBhcmFtIGVsXG4gKiBAcGFyYW0gZmluZEVsQnlJZFxuICogQHBhcmFtIGNiXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBvblBpY2tlZFVwKFxuICBlbDogQkFCWUxPTi5NZXNoLFxuICBmaW5kRWxCeUlkOiBGdW5jdGlvbixcbiAgY2I6IEZ1bmN0aW9uXG4pIHtcbiAgY29uc3Qgc2NlbmUgPSBlbC5nZXRTY2VuZSgpO1xuXG4gIC8vIEZJWE1FKFFMKTogSG93IHRvIGNsZWFudXA/XG4gIGNvbnN0IG9ic2VydmVyID0gc2NlbmUub25Qb2ludGVyT2JzZXJ2YWJsZS5hZGQoKHBvaW50ZXJJbmZvKSA9PiB7XG4gICAgc3dpdGNoIChwb2ludGVySW5mby50eXBlKSB7XG4gICAgICBjYXNlIEJBQllMT04uUG9pbnRlckV2ZW50VHlwZXMuUE9JTlRFUlVQOlxuICAgICAgICBsZXQgcG9pbnRlcklkID0gKHBvaW50ZXJJbmZvLmV2ZW50IGFzIGFueSkucG9pbnRlcklkO1xuICAgICAgICBpZiAoZmluZEVsQnlJZChwb2ludGVySWQpKSB7XG4gICAgICAgICAgY2IocG9pbnRlcklkKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH0pO1xufVxuXG4vKipcbiAqIENyZWF0ZSBhY2NlcHQgaGFuZGxlciB0aGF0IHJlcGxhY2VzIGN1cnJlbnQgZW50aXR5IHdpdGggYSBuZXcgYGZuYCwgd2hpbGUgcHJlc2V2ZSB0aGUgYGNvbXBvbmVudHNgIGFuZCBgY2hpbGRyZW5gXG4gKiBAcGFyYW0gZWxcbiAqIEByZXR1cm5zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBob3RSZXBsYWNlKFxuICBlbDogSUVudGl0eSxcbiAgbmV3RWxGbjogKHNjZW5lOiBCQUJZTE9OLlNjZW5lKSA9PiBJRW50aXR5IHwgUHJvbWlzZTxJRW50aXR5PlxuKSB7XG4gIHJldHVybiAoKSA9PiB7XG4gICAgbGV0IHNjZW5lOiBCQUJZTE9OLlNjZW5lO1xuICAgIGlmIChlbCBpbnN0YW5jZW9mIEJBQllMT04uV2ViWFJEZWZhdWx0RXhwZXJpZW5jZSkge1xuICAgICAgc2NlbmUgPSBlbC5iYXNlRXhwZXJpZW5jZS5jYW1lcmEuZ2V0U2NlbmUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2NlbmUgPSBlbC5nZXRTY2VuZSgpO1xuICAgIH1cbiAgICBjb25zdCBwYXJlbnQgPSAoZWwgYXMgYW55KS5wYXJlbnQ7XG4gICAgY29uc3QgeyBmbjogXywgY29tcG9uZW50cywgY2hpbGRyZW4gfSA9IChlbCBhcyBhbnkpLl9faG90X19kYXRhX187XG4gICAgZWwuZGlzcG9zZSgpO1xuICAgIChhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBuZXdFbCA9IGF3YWl0IEVudGl0eShuZXdFbEZuLCB7XG4gICAgICAgIGNvbXBvbmVudHMsXG4gICAgICAgIGNoaWxkcmVuLFxuICAgICAgfSkoc2NlbmUpO1xuICAgICAgKG5ld0VsIGFzIGFueSkucGFyZW50ID0gcGFyZW50O1xuICAgIH0pKCk7XG4gIH07XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IEJBQllMT047IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImRlY2xhcmUgZ2xvYmFsIHtcbiAgLyoqXG4gICAqIFdpbmRvdyB3aXRoIFNURkJcbiAgICovXG4gIGludGVyZmFjZSBXaW5kb3cge1xuICAgIFNURkI6IHtcbiAgICAgIC8vIGhvdyB0byBkZWNsYXJlIGFsbCB0aGUgZXhwb3J0IGhlcmVcbiAgICB9ICYgKChpbnRvPzogYW55KSA9PiB2b2lkKTtcbiAgfVxufVxuXG5pbXBvcnQgKiBhcyBjb3JlIGZyb20gXCIuL2NvcmVcIjtcbmltcG9ydCAqIGFzIHN0ZGxpYiBmcm9tIFwiLi9zdGRsaWJcIjtcblxuKCh3aW5kb3c6IFdpbmRvdykgPT4ge1xuICBjb25zdCBzYXZlZFNURkIgPSB3aW5kb3cuU1RGQjtcblxuICB3aW5kb3cuU1RGQiA9ICgoaW50bz86IGFueSkgPT4ge1xuICAgIGludG8gPSBpbnRvIHx8IHdpbmRvdztcbiAgICBPYmplY3QuYXNzaWduKGludG8sIGNvcmUpO1xuICAgIE9iamVjdC5hc3NpZ24oaW50bywgc3RkbGliKTtcblxuICAgIGlmIChzYXZlZFNURkIpIHtcbiAgICAgIHdpbmRvdy5TVEZCID0gc2F2ZWRTVEZCO1xuICAgIH1cbiAgfSkgYXMgYW55O1xuXG4gIE9iamVjdC5hc3NpZ24od2luZG93LlNURkIsIGNvcmUpO1xuICBPYmplY3QuYXNzaWduKHdpbmRvdy5TVEZCLCBzdGRsaWIpO1xufSkod2luZG93KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==