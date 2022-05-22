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
            if (registry[id] && registry[id] !== el) {
                if (noUniqueCheck) {
                    console.trace(`Id \`${id}' is already reserved for \'${registry[id]}'`);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7OztBQ0srQjtBQUNJO0FBRW5DLENBQUMsQ0FBQyxNQUFjLEVBQUUsRUFBRTtJQUNsQixNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO0lBRTlCLE1BQU0sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQVUsRUFBRSxFQUFFO1FBQzVCLElBQUksR0FBRyxJQUFJLElBQUksTUFBTSxDQUFDO1FBQ3RCLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLGtDQUFJLENBQUMsQ0FBQztRQUMxQixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxvQ0FBTSxDQUFDLENBQUM7UUFFNUIsSUFBSSxTQUFTLEVBQUU7WUFDYixNQUFNLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztTQUN6QjtJQUNILENBQUMsQ0FBUSxDQUFDO0lBRVYsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLGtDQUFJLENBQUMsQ0FBQztJQUNqQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsb0NBQU0sQ0FBQyxDQUFDO0FBQ3JDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc3RmYi8uL3NyYy9jb3JlLnRzIiwid2VicGFjazovL3N0ZmIvLi9zcmMvc3RkbGliLnRzIiwid2VicGFjazovL3N0ZmIvZXh0ZXJuYWwgdmFyIFwiQkFCWUxPTlwiIiwid2VicGFjazovL3N0ZmIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vc3RmYi93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9zdGZiL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9zdGZiL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vc3RmYi93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3N0ZmIvLi9zcmMvc3RmYi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBwYWNrYWdlRG9jdW1lbnRhdGlvbiBTdXBlciBUaW55IEZvdW5kYXRpb24gZm9yIEJBQllMT04sIGVuYWJsZXMgRUNTIHByaW5jaXBsZSBvbiBCQUJZTE9OIHNjZW5lc1xuICogQGF1dGhvciBRdWFuZy1MaW5oIExFXG4gKlxuICogU3lzdGVtOiBHbG9iYWwgc3RhdGVcbiAqIENvbXBvbmVudDogRnVuY3Rpb24gdGhhdCB0YWtlcyBgZW50aXR5JyBhcyBpdHMgZmlyc3QgYXJndW1lbnQsXG4gKiAgIGVuaGFuY2VzLCBtb2RpZmllcyBpdHMgYmVoYXZpb3IgaW4gc29tZSB3YXlzXG4gKiBFbnRpdHk6IEZ1bmN0aW9uIHRoYXQgdGFrZSBgc2NlbmVgIGFzIGl0cyBzb2xlIGFyZ3VtZW50LFxuICogICByZXR1cm5zIE5vZGUsIE1lc2gsIEZlYXR1cmUgZXRjLi4uIHRoYXQgY2FuIGJlIGVuaGFuY2VkIGJ5IENvbXBvbmVudFxuICovXG5cbmltcG9ydCAqIGFzIEJBQllMT04gZnJvbSBcImJhYnlsb25qc1wiO1xuXG5leHBvcnQgdHlwZSBJRW50aXR5ID1cbiAgfCBCQUJZTE9OLk5vZGVcbiAgfCBCQUJZTE9OLkNhbWVyYVxuICB8IEJBQllMT04uV2ViWFJEZWZhdWx0RXhwZXJpZW5jZTtcblxuLyoqXG4gKiBCb290c3RyYXAgYSBuZXcgc3lzdGVtIHdpdGggYSBgcmVnaXN0cnknXG4gKlxuICogQHBhcmFtIHJlZ2lzdHJ5IGdsb2JhbCBzdGF0ZVxuICogQHBhcmFtIG9wdCBvcHRpb25hbCB7IG5vVW5pcXVlQ2hlY2s6IGZhbHNlIH1cbiAqIEByZXR1cm5zIHsgc2V0RWxGb3JJZCwgZmluZEVsQnlJZCB9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBTeXN0ZW0ocmVnaXN0cnksIG9wdD86IHsgbm9VbmlxdWVDaGVjazogYm9vbGVhbiB9KSB7XG4gIGNvbnN0IG5vVW5pcXVlQ2hlY2sgPSBvcHQ/Lm5vVW5pcXVlQ2hlY2sgPz8gZmFsc2U7XG4gIHJldHVybiB7XG4gICAgc2V0RWxGb3JJZChlbCwgaWQpIHtcbiAgICAgIGlmIChyZWdpc3RyeVtpZF0gJiYgcmVnaXN0cnlbaWRdICE9PSBlbCkge1xuICAgICAgICBpZiAobm9VbmlxdWVDaGVjaykge1xuICAgICAgICAgIGNvbnNvbGUudHJhY2UoXG4gICAgICAgICAgICBgSWQgXFxgJHtpZH0nIGlzIGFscmVhZHkgcmVzZXJ2ZWQgZm9yIFxcJyR7cmVnaXN0cnlbaWRdfSdgXG4gICAgICAgICAgKTtcbiAgICAgICAgICByZWdpc3RyeVtpZF0gPSBlbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICBgSWQgXFxgJHtpZH0nIGlzIGFscmVhZHkgcmVzZXJ2ZWQgZm9yIFxcJyR7cmVnaXN0cnlbaWRdfSdgXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChlbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGRlbGV0ZSByZWdpc3RyeVtpZF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWdpc3RyeVtpZF0gPSBlbDtcbiAgICAgIH1cbiAgICB9LFxuICAgIGZpbmRFbEJ5SWQoaWQpIHtcbiAgICAgIHJldHVybiByZWdpc3RyeVtpZF07XG4gICAgfSxcbiAgfTtcbn1cblxuLyoqXG4gKiBCb290c3RyYXAgYSBzY2VuZVxuICogQHBhcmFtIHNjZW5lT3JDYW52YXNcbiAqIEBwYXJhbSBwYXJhbTFcbiAqIEByZXR1cm5zXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBTY2VuZShcbiAgc2NlbmVPckNhbnZhczogQkFCWUxPTi5TY2VuZSB8IEhUTUxDYW52YXNFbGVtZW50IHwgbnVsbCxcbiAge1xuICAgIGNvbXBvbmVudHMsXG4gICAgY2hpbGRyZW4sXG4gIH06IHtcbiAgICBjb21wb25lbnRzPzogKFxuICAgICAgfCAoKHNjZW5lOiBCQUJZTE9OLlNjZW5lKSA9PiB2b2lkIHwgUHJvbWlzZTx2b2lkPilcbiAgICAgIHwgKChzY2VuZTogQkFCWUxPTi5TY2VuZSwgLi4uYXJncykgPT4gdm9pZCB8IFByb21pc2U8dm9pZD4pXG4gICAgICB8IFsoc2NlbmU6IEJBQllMT04uU2NlbmUsIC4uLmFyZ3MpID0+IHZvaWQgfCBQcm9taXNlPHZvaWQ+LCAuLi5hbnldXG4gICAgKVtdO1xuICAgIGNoaWxkcmVuPzogKChzY2VuZTogQkFCWUxPTi5TY2VuZSkgPT4gUHJvbWlzZTxJRW50aXR5PilbXTtcbiAgfVxuKTogUHJvbWlzZTxCQUJZTE9OLlNjZW5lPiB7XG4gIGxldCBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50O1xuICBsZXQgZW5naW5lOiBCQUJZTE9OLkVuZ2luZTtcbiAgbGV0IHNjZW5lOiBCQUJZTE9OLlNjZW5lO1xuXG4gIC8vIERvIHdlIG5lZWQgYSBkZWZhdWx0IHNjZW5lP1xuXG4gIGlmIChzY2VuZU9yQ2FudmFzIGluc3RhbmNlb2YgQkFCWUxPTi5TY2VuZSkge1xuICAgIHNjZW5lID0gc2NlbmVPckNhbnZhcztcbiAgICBlbmdpbmUgPSBzY2VuZS5nZXRFbmdpbmUoKTtcbiAgICBjYW52YXMgPSBlbmdpbmUuZ2V0UmVuZGVyaW5nQ2FudmFzKCk7XG4gIH0gZWxzZSB7XG4gICAgY2FudmFzID1cbiAgICAgIHNjZW5lT3JDYW52YXMgaW5zdGFuY2VvZiBIVE1MQ2FudmFzRWxlbWVudFxuICAgICAgICA/IHNjZW5lT3JDYW52YXNcbiAgICAgICAgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgIGNhbnZhcy5zdHlsZS5jc3NUZXh0ID0gXCJ3aWR0aDogMTAwJTsgaGVpZ2h0OiAxMDAlOyB0b3VjaC1hY3Rpb246IG5vbmU7XCI7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjYW52YXMpO1xuXG4gICAgZW5naW5lID0gbmV3IEJBQllMT04uRW5naW5lKGNhbnZhcywgdHJ1ZSwge1xuICAgICAgcHJlc2VydmVEcmF3aW5nQnVmZmVyOiB0cnVlLFxuICAgICAgc3RlbmNpbDogdHJ1ZSxcbiAgICAgIGRpc2FibGVXZWJHTDJTdXBwb3J0OiBmYWxzZSxcbiAgICB9KTtcblxuICAgIHNjZW5lID0gbmV3IEJBQllMT04uU2NlbmUoZW5naW5lKTtcbiAgfVxuXG4gIGZvciAoY29uc3QgY29tcG9uZW50IG9mIGNvbXBvbmVudHMgfHwgW10pIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShjb21wb25lbnQpKSB7XG4gICAgICBjb25zdCBbZm4sIC4uLmFyZ3NdID0gY29tcG9uZW50O1xuICAgICAgYXdhaXQgZm4oc2NlbmUsIC4uLmFyZ3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhd2FpdCBjb21wb25lbnQoc2NlbmUpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGNoaWxkRWxzID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgKGNoaWxkcmVuIHx8IFtdKS5tYXAoKGNoaWxkRm4pID0+IGNoaWxkRm4oc2NlbmUpKVxuICApO1xuXG4gIC8vIERvIHdlIG5lZWQgYSBkZWZhdWx0IGxpZ2h0P1xuICBsZXQgbGlnaHQgPSAoY2hpbGRFbHMuZmluZChcbiAgICAoZWwpID0+IGVsIGluc3RhbmNlb2YgQkFCWUxPTi5MaWdodFxuICApIGFzIHVua25vd24pIGFzIEJBQllMT04uTGlnaHQ7XG4gIGlmICghbGlnaHQpIHtcbiAgICBsaWdodCA9IENyZWF0ZURlZmF1bHRMaWdodChzY2VuZSk7XG4gIH1cblxuICAvLyBEbyB3ZSBuZWVkIGEgZGVmYXVsdCBjYW1lcmE/XG4gIGxldCBjYW1lcmEgPSAoY2hpbGRFbHMuZmluZChcbiAgICAoZWwpID0+IGVsIGluc3RhbmNlb2YgQkFCWUxPTi5DYW1lcmFcbiAgKSBhcyB1bmtub3duKSBhcyBCQUJZTE9OLkNhbWVyYTtcbiAgaWYgKCFjYW1lcmEpIHtcbiAgICBjYW1lcmEgPSBDcmVhdGVEZWZhdWx0Q2FtZXJhKHNjZW5lKTtcbiAgfVxuXG4gIGVuZ2luZS5ydW5SZW5kZXJMb29wKCgpID0+IHNjZW5lLnJlbmRlcigpKTtcblxuICByZXR1cm4gc2NlbmU7XG59XG5cbi8qKlxuICogRW50aXR5IGlzIGJhc2ljYWxseSBhIE1lc2ggb3IgYSBGZWF0dXJlIHRoYXQgaXRzIGJlaGF2aW9yIGNhbiBiZSBtb2RpZmllZCBieSBzb21lIGZ1bmN0aW9ucyAoQ29tcG9uZW50cylcbiAqIGFuZCBtYXkgaGF2ZSBjaGlsZHJlbiB0aGF0IGFyZSBhbHNvIEVudGl0aWVzXG4gKiBAcGFyYW0gZm5cbiAqIEBwYXJhbSBvcHQgIHsgY29tcG9uZW50cywgY2hpbGRyZW4gfVxuICogQHJldHVybnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIEVudGl0eShcbiAgZm46IChzY2VuZTogQkFCWUxPTi5TY2VuZSkgPT4gSUVudGl0eSB8IFByb21pc2U8SUVudGl0eT4sXG4gIHtcbiAgICBjb21wb25lbnRzLFxuICAgIGNoaWxkcmVuLFxuICB9OiB7XG4gICAgY29tcG9uZW50cz86IChcbiAgICAgIHwgKChlbDogSUVudGl0eSkgPT4gdm9pZCB8IFByb21pc2U8dm9pZD4pXG4gICAgICB8ICgoZWw6IElFbnRpdHksIC4uLmFyZ3MpID0+IHZvaWQgfCBQcm9taXNlPHZvaWQ+KVxuICAgICAgfCBbKGVsOiBJRW50aXR5LCAuLi5hcmdzKSA9PiB2b2lkIHwgUHJvbWlzZTx2b2lkPiwgLi4uYW55XVxuICAgIClbXTtcbiAgICBjaGlsZHJlbj86ICgoc2NlbmU6IEJBQllMT04uU2NlbmUpID0+IFByb21pc2U8SUVudGl0eSAmIHsgcGFyZW50OiBhbnkgfT4pW107IC8vIHN1cGVyIG9mIFQ/XG4gIH0gPSB7IGNvbXBvbmVudHM6IFtdLCBjaGlsZHJlbjogW10gfVxuKSB7XG4gIHJldHVybiBhc3luYyAoc2NlbmU6IEJBQllMT04uU2NlbmUpID0+IHtcbiAgICBjb25zdCBlbCA9IGF3YWl0IGZuKHNjZW5lKTtcblxuICAgIGZvciAoY29uc3QgY29tcG9uZW50IG9mIGNvbXBvbmVudHMgfHwgW10pIHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGNvbXBvbmVudCkpIHtcbiAgICAgICAgY29uc3QgW2ZuLCAuLi5hcmdzXSA9IGNvbXBvbmVudDtcbiAgICAgICAgYXdhaXQgZm4oZWwsIC4uLmFyZ3MpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXdhaXQgY29tcG9uZW50KGVsKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGNoaWxkRm4gb2YgY2hpbGRyZW4gfHwgW10pIHtcbiAgICAgIGxldCBjaGlsZEVsID0gYXdhaXQgY2hpbGRGbihzY2VuZSk7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShjaGlsZEVsKSkge1xuICAgICAgICBmb3IgKGNvbnN0IGMgb2YgY2hpbGRFbCkge1xuICAgICAgICAgIGMucGFyZW50ID0gZWw7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNoaWxkRWwucGFyZW50ID0gZWw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG1vZHVsZS5ob3QpIHtcbiAgICAgIChlbCBhcyBhbnkpLl9faG90X19kYXRhX18gPSB7IGZuLCBjb21wb25lbnRzLCBjaGlsZHJlbiB9OyAvLyBUT0RPKFFMKTogYXJndW1lbnRzIGlzIG5vdCB3b3JraW5nIGhlcmVcbiAgICB9XG5cbiAgICByZXR1cm4gZWw7XG4gIH07XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgZGVmYXVsdCBMaWdodCBmb3IgYHNjZW5lYCAoaWYgbm90IGV4aXN0KVxuICpcbiAqIEEgYENvbXBvbmVudGAgZm9yIGBzY2VuZWBcbiAqIEBwYXJhbSBzY2VuZVxuICogQHJldHVybnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIENyZWF0ZURlZmF1bHRMaWdodChzY2VuZTogQkFCWUxPTi5TY2VuZSkge1xuICAvLyBUaGlzIGNyZWF0ZXMgYSBsaWdodCwgYWltaW5nIDAsMSwwIC0gdG8gdGhlIHNreSAobm9uLW1lc2gpXG4gIGNvbnN0IGxpZ2h0ID0gbmV3IEJBQllMT04uSGVtaXNwaGVyaWNMaWdodChcbiAgICBcImxpZ2h0XCIsXG4gICAgbmV3IEJBQllMT04uVmVjdG9yMygwLCAxLCAwKSxcbiAgICBzY2VuZVxuICApO1xuXG4gIC8vIERlZmF1bHQgaW50ZW5zaXR5IGlzIDEuIExldCdzIGRpbSB0aGUgbGlnaHQgYSBzbWFsbCBhbW91bnRcbiAgbGlnaHQuaW50ZW5zaXR5ID0gMC43O1xuICByZXR1cm4gbGlnaHQ7XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgZGVmYXVsdCBDYW1lcmEgZm9yIGBzY2VuZWAgKGlmIG5vdCBleGlzdClcbiAqXG4gKiBBIGBDb21wb25lbnRgIGZvciBgc2NlbmVgXG4gKiBAcGFyYW0gc2NlbmVcbiAqIEByZXR1cm5zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBDcmVhdGVEZWZhdWx0Q2FtZXJhKHNjZW5lOiBCQUJZTE9OLlNjZW5lKSB7XG4gIC8vIFRoaXMgY3JlYXRlcyBhbmQgcG9zaXRpb25zIGEgZnJlZSBjYW1lcmEgKG5vbi1tZXNoKVxuICBjb25zdCBjYW1lcmEgPSBuZXcgQkFCWUxPTi5GcmVlQ2FtZXJhKFxuICAgIFwiY2FtZXJhXCIsXG4gICAgbmV3IEJBQllMT04uVmVjdG9yMygwLCA1LCAtMTApLFxuICAgIHNjZW5lXG4gICk7XG5cbiAgLy8gVGhpcyB0YXJnZXRzIHRoZSBjYW1lcmEgdG8gc2NlbmUgb3JpZ2luXG4gIGNhbWVyYS5zZXRUYXJnZXQoQkFCWUxPTi5WZWN0b3IzLlplcm8oKSk7XG5cbiAgLy8gVGhpcyBhdHRhY2hlcyB0aGUgY2FtZXJhIHRvIHRoZSBjYW52YXNcbiAgY2FtZXJhLmF0dGFjaENvbnRyb2woc2NlbmUuZ2V0RW5naW5lKCkuZ2V0UmVuZGVyaW5nQ2FudmFzKCksIHRydWUpO1xuICByZXR1cm4gY2FtZXJhO1xufVxuIiwiLyoqXG4gKiBAcGFja2FnZURvY3VtZW50YXRpb24gU3VwZXIgVGlueSBGb3VuZGF0aW9uIGZvciBCQUJZTE9OLCBzdGRsaWJcbiAqIEBhdXRob3IgUXVhbmctTGluaCBMRVxuICovXG5cbi8vIFBoeXNpY3NcblxuaW1wb3J0ICogYXMgQkFCWUxPTiBmcm9tIFwiYmFieWxvbmpzXCI7XG5pbXBvcnQgeyBFbnRpdHksIElFbnRpdHkgfSBmcm9tIFwiLi9jb3JlXCI7XG5cbi8qKlxuICogQ29tcG5lbnQ6IEVuYWJsZSBwaHlzaWNzIGZvciBgc2NlbmUnXG4gKiBAcGFyYW0gc2NlbmVcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGVuYWJsZVBoeXNpY3Moc2NlbmU6IEJBQllMT04uU2NlbmUpIHtcbiAgc2NlbmUuZW5hYmxlUGh5c2ljcyhcbiAgICBuZXcgQkFCWUxPTi5WZWN0b3IzKDAsIC05LjgxLCAwKSxcbiAgICBuZXcgQkFCWUxPTi5BbW1vSlNQbHVnaW4oKVxuICApO1xufVxuXG4vKipcbiAqIENvbXBvbmVudDogV2l0aCBwaHlzaWNzIGVuYWJsZWQgb24gc2NlbmUsIGVuYWJsZSBpdCBmb3IgbWVzaCBgZWwnXG4gKiBAcGFyYW0gZWxcbiAqIEBwYXJhbSBtYXNzXG4gKiBAcGFyYW0gcmVzdGl0dXRpb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHdpdGhQaHlzaWNzKFxuICBlbDogQkFCWUxPTi5NZXNoLFxuICBtYXNzOiBudW1iZXIsXG4gIHJlc3RpdHV0aW9uOiBudW1iZXJcbikge1xuICBjb25zdCBwaHlzaWNzSW1wb3N0b3IgPSBuZXcgQkFCWUxPTi5QaHlzaWNzSW1wb3N0b3IoXG4gICAgZWwsXG4gICAgQkFCWUxPTi5QaHlzaWNzSW1wb3N0b3IuU3BoZXJlSW1wb3N0b3IsXG4gICAgeyBtYXNzLCByZXN0aXR1dGlvbiB9LFxuICAgIGVsLmdldFNjZW5lKClcbiAgKTtcbiAgZWwucGh5c2ljc0ltcG9zdG9yID0gcGh5c2ljc0ltcG9zdG9yO1xufVxuXG4vLyBEZWJ1Z1xuXG4vKipcbiAqIENvbXBvbmVudDogRW5hYmxlIGRlYnVnIGZvciBzY2VuZVxuICogQHBhcmFtIHNjZW5lXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBlbmFibGVEZWJ1ZyhzY2VuZTogQkFCWUxPTi5TY2VuZSkge1xuICBzY2VuZS5kZWJ1Z0xheWVyLnNob3coKTtcbn1cblxuLy8gTWF0ZXJpYWxcblxuZXhwb3J0IGZ1bmN0aW9uIHdpdGhQQlJNYXRCeUNvbG9yKGVsOiBCQUJZTE9OLk1lc2gsIGNvbG9yOiBzdHJpbmcpIHtcbiAgY29uc3QgbWF0ID0gbmV3IEJBQllMT04uUEJSTWF0ZXJpYWwoXCJibHVlXCIsIGVsLmdldFNjZW5lKCkpO1xuICBtYXQuYWxiZWRvQ29sb3IgPSBCQUJZTE9OLkNvbG9yMy5Gcm9tSGV4U3RyaW5nKGNvbG9yKTtcbiAgbWF0Lm1ldGFsbGljID0gMC45OTtcbiAgbWF0LnJvdWdobmVzcyA9IDAuMDE7XG4gIGVsLm1hdGVyaWFsID0gbWF0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gd2l0aFJlZE1hdChlbDogQkFCWUxPTi5NZXNoKSB7XG4gIHJldHVybiB3aXRoUEJSTWF0QnlDb2xvcihlbCwgXCIjRUYyRDVFXCIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gd2l0aEdyZWVuTWF0KGVsOiBCQUJZTE9OLk1lc2gpIHtcbiAgcmV0dXJuIHdpdGhQQlJNYXRCeUNvbG9yKGVsLCBcIiM3QkM4QTRcIik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3aXRoQmx1ZU1hdChlbDogQkFCWUxPTi5NZXNoKSB7XG4gIHJldHVybiB3aXRoUEJSTWF0QnlDb2xvcihlbCwgXCIjNENDM0Q5XCIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gd2l0aFllbGxvd01hdChlbDogQkFCWUxPTi5NZXNoKSB7XG4gIHJldHVybiB3aXRoUEJSTWF0QnlDb2xvcihlbCwgXCIjRkZDNjVEXCIpO1xufVxuXG4vLyBYUlxuXG4vKipcbiAqIEVudGl0eTogQWRkIFhSIG9uIGBzY2VuZSdcbiAqIEBwYXJhbSBzY2VuZVxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gWFIoc2NlbmUpIHtcbiAgcmV0dXJuIHNjZW5lLmNyZWF0ZURlZmF1bHRYUkV4cGVyaWVuY2VBc3luYygpO1xufVxuXG4vKipcbiAqIEVuYWJsZSBQb2ludGVyIFNlbGVjdGlvblxuICpcbiAqIEEgQ29tcG9uZW50IGZvciBgeHJIZWxwZXJgXG4gKiBAcGFyYW0geHJIZWxwZXJcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdpdGhQb2ludGVyU2VsZWN0aW9uKFxuICB4ckhlbHBlcjogQkFCWUxPTi5XZWJYUkRlZmF1bHRFeHBlcmllbmNlXG4pIHtcbiAgY29uc3QgZmVhdHVyZXNNYW5hZ2VyID0geHJIZWxwZXIuYmFzZUV4cGVyaWVuY2UuZmVhdHVyZXNNYW5hZ2VyO1xuXG4gIGZlYXR1cmVzTWFuYWdlci5lbmFibGVGZWF0dXJlKFxuICAgIEJBQllMT04uV2ViWFJGZWF0dXJlTmFtZS5QT0lOVEVSX1NFTEVDVElPTixcbiAgICBcInN0YWJsZVwiLFxuICAgIHtcbiAgICAgIHhySW5wdXQ6IHhySGVscGVyLmlucHV0LFxuICAgICAgZW5hYmxlUG9pbnRlclNlbGVjdGlvbk9uQWxsQ29udHJvbGxlcnM6IHRydWUsXG4gICAgfVxuICApO1xufVxuXG4vKipcbiAqIEVuYWJsZSBUZWxlcG9ydGF0aW9uXG4gKlxuICogQSBDb21wb25lbnQgZm9yIGB4ckhlbHBlcmBcbiAqIEBwYXJhbSB4ckhlbHBlclxuICogQHBhcmFtIGZsb29yc1xuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2l0aFRlbGVwb3J0YXRpb24oXG4gIHhySGVscGVyOiBCQUJZTE9OLldlYlhSRGVmYXVsdEV4cGVyaWVuY2UsXG4gIGZsb29yczogQkFCWUxPTi5NZXNoW10gfCBGdW5jdGlvbiB8IHVuZGVmaW5lZFxuKSB7XG4gIGNvbnN0IGZlYXR1cmVzTWFuYWdlciA9IHhySGVscGVyLmJhc2VFeHBlcmllbmNlLmZlYXR1cmVzTWFuYWdlcjtcblxuICBsZXQgZmxvb3JNZXNoZXM6IEJBQllMT04uTWVzaFtdO1xuXG4gIGlmIChmbG9vcnMgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgIGZsb29yTWVzaGVzID0gZmxvb3JzKCk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKCFmbG9vcnMgfHwgZmxvb3JzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgY29uc3Qgc2NlbmUgPSB4ckhlbHBlci5iYXNlRXhwZXJpZW5jZS5zZXNzaW9uTWFuYWdlci5zY2VuZTtcbiAgICAgIGNvbnN0IGdyb3VuZCA9IEJBQllMT04uTWVzaEJ1aWxkZXIuQ3JlYXRlR3JvdW5kKFxuICAgICAgICBcImdyb3VuZFwiLFxuICAgICAgICB7XG4gICAgICAgICAgd2lkdGg6IDQwMCxcbiAgICAgICAgICBoZWlnaHQ6IDQwMCxcbiAgICAgICAgfSxcbiAgICAgICAgc2NlbmVcbiAgICAgICk7XG4gICAgICBmbG9vcnMgPSBbZ3JvdW5kXTtcbiAgICB9XG4gICAgZmxvb3JNZXNoZXMgPSBmbG9vcnM7XG4gIH1cblxuICBmZWF0dXJlc01hbmFnZXIuZW5hYmxlRmVhdHVyZShcbiAgICBCQUJZTE9OLldlYlhSRmVhdHVyZU5hbWUuVEVMRVBPUlRBVElPTixcbiAgICBcInN0YWJsZVwiLFxuICAgIHtcbiAgICAgIHhySW5wdXQ6IHhySGVscGVyLmlucHV0LFxuICAgICAgZmxvb3JNZXNoZXM6IGZsb29yTWVzaGVzLFxuICAgICAgc25hcFBvc2l0aW9uczogW10sXG4gICAgfVxuICApO1xufVxuXG4vKipcbiAqIEVuYWJsZSBoYW5kdHJhY2tpbmdcbiAqXG4gKiBBIENvbXBvbmVudCBmb3IgYHhySGVscGVyYFxuICogQHBhcmFtIHhySGVscGVyXG4gKiBAcGFyYW0gc2V0RWxGb3JJZFxuICogQHBhcmFtIGxlZnRIYW5kSWRcbiAqIEBwYXJhbSByaWdodEhhbmRJZFxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2l0aEhhbmRUcmFja2luZyhcbiAgeHJIZWxwZXI6IEJBQllMT04uV2ViWFJEZWZhdWx0RXhwZXJpZW5jZSxcbiAgc2V0RWxGb3JJZDogRnVuY3Rpb24sXG4gIGxlZnRIYW5kSWQgPSBcImxlZnRIYW5kXCIsXG4gIHJpZ2h0SGFuZElkID0gXCJyaWdodEhhbmRcIlxuKSB7XG4gIGNvbnN0IGZlYXR1cmVzTWFuYWdlciA9IHhySGVscGVyLmJhc2VFeHBlcmllbmNlLmZlYXR1cmVzTWFuYWdlcjtcblxuICBjb25zdCBhdmFpbGFibGVGZWF0dXJlcyA9IEJBQllMT04uV2ViWFJGZWF0dXJlc01hbmFnZXIuR2V0QXZhaWxhYmxlRmVhdHVyZXMoKTtcblxuICBpZiAoXG4gICAgYXZhaWxhYmxlRmVhdHVyZXMuZmluZChcbiAgICAgIChpdCkgPT4gaXQgPT09IEJBQllMT04uV2ViWFJGZWF0dXJlTmFtZS5IQU5EX1RSQUNLSU5HXG4gICAgKVxuICApIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgeHJIYW5kRmVhdHVyZTogQkFCWUxPTi5JV2ViWFJGZWF0dXJlICZcbiAgICAgICAgYW55ID0gZmVhdHVyZXNNYW5hZ2VyLmVuYWJsZUZlYXR1cmUoXG4gICAgICAgIEJBQllMT04uV2ViWFJGZWF0dXJlTmFtZS5IQU5EX1RSQUNLSU5HLFxuICAgICAgICBcImxhdGVzdFwiLFxuICAgICAgICB7XG4gICAgICAgICAgeHJJbnB1dDogeHJIZWxwZXIuaW5wdXQsXG4gICAgICAgICAgam9pbnRNZXNoZXM6IHtcbiAgICAgICAgICAgIGVuYWJsZVBoeXNpY3M6IHRydWUsXG4gICAgICAgICAgfSxcbiAgICAgICAgfVxuICAgICAgKTtcblxuICAgICAgeHJIYW5kRmVhdHVyZS5vbkhhbmRBZGRlZE9ic2VydmFibGUuYWRkKChoYW5kKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiSEFORCBBRERFRFwiLCBoYW5kKTtcblxuICAgICAgICBpZiAoaGFuZC54ckNvbnRyb2xsZXIuaW5wdXRTb3VyY2UuaGFuZGVkbmVzcyA9PT0gXCJsZWZ0XCIpIHtcbiAgICAgICAgICBzZXRFbEZvcklkKGhhbmQsIGxlZnRIYW5kSWQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChoYW5kLnhyQ29udHJvbGxlci5pbnB1dFNvdXJjZS5oYW5kZWRuZXNzID09PSBcInJpZ2h0XCIpIHtcbiAgICAgICAgICBzZXRFbEZvcklkKGhhbmQsIHJpZ2h0SGFuZElkKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHhySGFuZEZlYXR1cmUub25IYW5kUmVtb3ZlZE9ic2VydmFibGUuYWRkKChoYW5kKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiSEFORCBSRU1PVkVEXCIsIGhhbmQpO1xuXG4gICAgICAgIGlmIChoYW5kLnhyQ29udHJvbGxlci5pbnB1dFNvdXJjZS5oYW5kZWRuZXNzID09PSBcImxlZnRcIikge1xuICAgICAgICAgIHNldEVsRm9ySWQodW5kZWZpbmVkLCBsZWZ0SGFuZElkKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaGFuZC54ckNvbnRyb2xsZXIuaW5wdXRTb3VyY2UuaGFuZGVkbmVzcyA9PT0gXCJyaWdodFwiKSB7XG4gICAgICAgICAgc2V0RWxGb3JJZCh1bmRlZmluZWQsIHJpZ2h0SGFuZElkKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZTogdW5rbm93bikge1xuICAgICAgY29uc29sZS5sb2coXCJ3aXRoSGFuZFRyYWNraW5nXCIsIFwiVW5hYmxlIHRvIGVuYWJsZSBoYW5kIHRyYWNraW5nXCIpO1xuICAgIH1cbiAgfVxufVxuXG4vLyBQaWNrXG5cbi8qKlxuICogQ29tcG9uZW50OiBBY3Rpb24gd2hlbiB0aGUgbWVzaCBoYXMgYmVlbiBwaWNrIChidXQgbm90IG5lY2Nlc3NhcnkgcmVsZWFzZSlcbiAqIEBwYXJhbSBlbFxuICogQHBhcmFtIHNldEVsRm9ySWRcbiAqIEBwYXJhbSBjYlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gb25QaWNrZWREb3duKFxuICBlbDogQkFCWUxPTi5NZXNoLFxuICBzZXRFbEZvcklkOiBGdW5jdGlvbixcbiAgY2I6IEZ1bmN0aW9uXG4pIHtcbiAgY29uc3Qgc2NlbmUgPSBlbC5nZXRTY2VuZSgpO1xuXG4gIC8vIEZJWE1FKFFMKTogSG93IHRvIGNsZWFudXA/XG4gIGNvbnN0IG9ic2VydmVyID0gc2NlbmUub25Qb2ludGVyT2JzZXJ2YWJsZS5hZGQoKHBvaW50ZXJJbmZvKSA9PiB7XG4gICAgc3dpdGNoIChwb2ludGVySW5mby50eXBlKSB7XG4gICAgICBjYXNlIEJBQllMT04uUG9pbnRlckV2ZW50VHlwZXMuUE9JTlRFUkRPV046XG4gICAgICAgIGlmIChwb2ludGVySW5mby5waWNrSW5mby5oaXQpIHtcbiAgICAgICAgICBsZXQgcGlja2VkTWVzaCA9IHBvaW50ZXJJbmZvLnBpY2tJbmZvLnBpY2tlZE1lc2g7XG4gICAgICAgICAgbGV0IHBvaW50ZXJJZCA9IChwb2ludGVySW5mby5ldmVudCBhcyBhbnkpLnBvaW50ZXJJZDtcbiAgICAgICAgICBpZiAocGlja2VkTWVzaCA9PT0gZWwpIHtcbiAgICAgICAgICAgIHNldEVsRm9ySWQocG9pbnRlcklkLCBvYnNlcnZlcik7XG4gICAgICAgICAgICBjYihwb2ludGVySW5mbyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfSk7XG59XG5cbi8qKlxuICogQ29tcG9uZW50OiBBY3Rpb24gd2hlbiBtZXNoIGhhcyBiZWVuIHJlbGVhc2UsIHNob3VsZCB3b3JrIG9ubHkgd2hlbiBgb25QaWNrZWREb3duYCBpcyBhbHNvIHNldFxuICogQHBhcmFtIGVsXG4gKiBAcGFyYW0gZmluZEVsQnlJZFxuICogQHBhcmFtIGNiXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBvblBpY2tlZFVwKFxuICBlbDogQkFCWUxPTi5NZXNoLFxuICBmaW5kRWxCeUlkOiBGdW5jdGlvbixcbiAgY2I6IEZ1bmN0aW9uXG4pIHtcbiAgY29uc3Qgc2NlbmUgPSBlbC5nZXRTY2VuZSgpO1xuXG4gIC8vIEZJWE1FKFFMKTogSG93IHRvIGNsZWFudXA/XG4gIGNvbnN0IG9ic2VydmVyID0gc2NlbmUub25Qb2ludGVyT2JzZXJ2YWJsZS5hZGQoKHBvaW50ZXJJbmZvKSA9PiB7XG4gICAgc3dpdGNoIChwb2ludGVySW5mby50eXBlKSB7XG4gICAgICBjYXNlIEJBQllMT04uUG9pbnRlckV2ZW50VHlwZXMuUE9JTlRFUlVQOlxuICAgICAgICBsZXQgcG9pbnRlcklkID0gKHBvaW50ZXJJbmZvLmV2ZW50IGFzIGFueSkucG9pbnRlcklkO1xuICAgICAgICBpZiAoZmluZEVsQnlJZChwb2ludGVySWQpKSB7XG4gICAgICAgICAgY2IocG9pbnRlcklkKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH0pO1xufVxuXG4vKipcbiAqIFJlcGxhY2UgYW4gZW50aXR5IHdpdGggYSBuZXcgYGZuYCwgd2hpbGUgcHJlc2V2ZSB0aGUgYGNvbXBvbmVudHNgIGFuZCBgY2hpbGRyZW5gXG4gKlxuICogT25seSB3b3JrIHdpdGggSE1SIGVuYWJsZWQgKG9yIGBtb2R1bGUuaG90YCBpcyB0cnV0aHkpXG4gKiBAcGFyYW0gZWxcbiAqIEByZXR1cm5zXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZXBsYWNlRW50aXR5KFxuICBlbDogSUVudGl0eSxcbiAgbmV3RWxGbjogKHNjZW5lOiBCQUJZTE9OLlNjZW5lKSA9PiBJRW50aXR5IHwgUHJvbWlzZTxJRW50aXR5PlxuKSB7XG4gIGlmICghZWwpIHtcbiAgICBjb25zb2xlLnRyYWNlKFwicmVwbGFjZUVudGl0eVwiLCBcIkVudGl0eSBub3QgZm91bmRcIik7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxldCBzY2VuZTogQkFCWUxPTi5TY2VuZTtcbiAgaWYgKGVsIGluc3RhbmNlb2YgQkFCWUxPTi5XZWJYUkRlZmF1bHRFeHBlcmllbmNlKSB7XG4gICAgc2NlbmUgPSBlbC5iYXNlRXhwZXJpZW5jZS5jYW1lcmEuZ2V0U2NlbmUoKTtcbiAgfSBlbHNlIHtcbiAgICBzY2VuZSA9IGVsLmdldFNjZW5lKCk7XG4gIH1cbiAgY29uc3QgcGFyZW50ID0gKGVsIGFzIGFueSkucGFyZW50OyAvLyBJZiBpdCBleGlzdHNcbiAgY29uc3QgeyBmbjogXywgY29tcG9uZW50cywgY2hpbGRyZW4gfSA9IChlbCBhcyBhbnkpLl9faG90X19kYXRhX187XG4gIGlmICgoZWwgYXMgQkFCWUxPTi5NZXNoKS5waHlzaWNzSW1wb3N0b3IpIHtcbiAgICAoZWwgYXMgQkFCWUxPTi5NZXNoKS5waHlzaWNzSW1wb3N0b3IuZGlzcG9zZSgpO1xuICB9XG4gIGVsLmRpc3Bvc2UoKTtcblxuICBjb25zdCBuZXdFbCA9IGF3YWl0IEVudGl0eShuZXdFbEZuLCB7XG4gICAgY29tcG9uZW50cyxcbiAgICBjaGlsZHJlbixcbiAgfSkoc2NlbmUpO1xuICAobmV3RWwgYXMgYW55KS5wYXJlbnQgPSBwYXJlbnQ7XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IEJBQllMT047IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImRlY2xhcmUgZ2xvYmFsIHtcbiAgLyoqXG4gICAqIFdpbmRvdyB3aXRoIFNURkJcbiAgICovXG4gIGludGVyZmFjZSBXaW5kb3cge1xuICAgIFNURkI6IHtcbiAgICAgIC8vIGhvdyB0byBkZWNsYXJlIGFsbCB0aGUgZXhwb3J0IGhlcmVcbiAgICB9ICYgKChpbnRvPzogYW55KSA9PiB2b2lkKTtcbiAgfVxufVxuXG5pbXBvcnQgKiBhcyBjb3JlIGZyb20gXCIuL2NvcmVcIjtcbmltcG9ydCAqIGFzIHN0ZGxpYiBmcm9tIFwiLi9zdGRsaWJcIjtcblxuKCh3aW5kb3c6IFdpbmRvdykgPT4ge1xuICBjb25zdCBzYXZlZFNURkIgPSB3aW5kb3cuU1RGQjtcblxuICB3aW5kb3cuU1RGQiA9ICgoaW50bz86IGFueSkgPT4ge1xuICAgIGludG8gPSBpbnRvIHx8IHdpbmRvdztcbiAgICBPYmplY3QuYXNzaWduKGludG8sIGNvcmUpO1xuICAgIE9iamVjdC5hc3NpZ24oaW50bywgc3RkbGliKTtcblxuICAgIGlmIChzYXZlZFNURkIpIHtcbiAgICAgIHdpbmRvdy5TVEZCID0gc2F2ZWRTVEZCO1xuICAgIH1cbiAgfSkgYXMgYW55O1xuXG4gIE9iamVjdC5hc3NpZ24od2luZG93LlNURkIsIGNvcmUpO1xuICBPYmplY3QuYXNzaWduKHdpbmRvdy5TVEZCLCBzdGRsaWIpO1xufSkod2luZG93KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==