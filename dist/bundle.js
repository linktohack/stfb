(()=>{"use strict";var e={n:n=>{var t=n&&n.__esModule?()=>n.default:()=>n;return e.d(t,{a:t}),t},d:(n,t)=>{for(var r in t)e.o(t,r)&&!e.o(n,r)&&Object.defineProperty(n,r,{enumerable:!0,get:t[r]})},o:(e,n)=>Object.prototype.hasOwnProperty.call(e,n),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},n={};e.r(n),e.d(n,{CreateDefaultCamera:()=>s,CreateDefaultLight:()=>i,Entity:()=>a,Scene:()=>o,System:()=>r});var t={};function r(e){return{setElForId(n,t){if(e[t]&&e[t]!==n)throw new Error(`Id \`${t}' is already reserved for '${e[t]}'`);void 0===n?delete e[t]:e[t]=n},findElById:n=>e[n]}}async function o(e,{components:n,children:t}){let r,o,a;e instanceof BABYLON.Scene?(a=e,o=a.getEngine(),r=o.getRenderingCanvas()):(r=e instanceof HTMLCanvasElement?e:document.createElement("canvas"),r.style.cssText="width: 100%; height: 100%; touch-action: none;",document.body.appendChild(r),o=new BABYLON.Engine(r,!0,{preserveDrawingBuffer:!0,stencil:!0,disableWebGL2Support:!1}),a=new BABYLON.Scene(o));for(const e of n||[])if(Array.isArray(e)){const[n,...t]=e;n(a,...t)}else await e(a);const c=await Promise.all((t||[]).map((e=>e(a))));let l=c.find((e=>e instanceof BABYLON.Light));l||(l=i(a));let u=c.find((e=>e instanceof BABYLON.Camera));return u||(u=s(a)),o.runRenderLoop((()=>a.render())),a}function a(e,{components:n,children:t}={components:[],children:[]}){return async r=>{const o=await e(r);for(const e of n||[])if(Array.isArray(e)){const[n,...t]=e;n(o,...t)}else await e(o);for(const e of t||[]){let n=await e(r);if(Array.isArray(n))for(const e of n)e.parent=o;else n.parent=o}return o}}function i(e){const n=new BABYLON.HemisphericLight("light",new BABYLON.Vector3(0,1,0),e);return n.intensity=.7,n}function s(e){const n=new BABYLON.FreeCamera("camera",new BABYLON.Vector3(0,5,-10),e);return n.setTarget(BABYLON.Vector3.Zero()),n.attachControl(e.getEngine().getRenderingCanvas(),!0),n}e.r(t),e.d(t,{XR:()=>m,enableDebug:()=>p,enablePhysics:()=>d,onPickedDown:()=>E,onPickedUp:()=>N,withBlueMat:()=>y,withGreenMat:()=>b,withHandTracking:()=>O,withPBRMatByColor:()=>h,withPhysics:()=>f,withPointerSelection:()=>A,withRedMat:()=>g,withTeleportation:()=>B,withYellowMat:()=>w});const c=BABYLON,l=Ammo;var u=e.n(l);async function d(e){await u()(),e.enablePhysics(new c.Vector3(0,-9.81,0),new c.AmmoJSPlugin)}function f(e,n,t){const r=new c.PhysicsImpostor(e,c.PhysicsImpostor.SphereImpostor,{mass:n,restitution:t},e.getScene());e.physicsImpostor=r}async function p(e){e.debugLayer.show()}function h(e,n){const t=new c.PBRMaterial("blue",e.getScene());t.albedoColor=c.Color3.FromHexString(n),t.metallic=.99,t.roughness=.01,e.material=t}function g(e){return h(e,"#EF2D5E")}function b(e){return h(e,"#7BC8A4")}function y(e){return h(e,"#4CC3D9")}function w(e){return h(e,"#FFC65D")}async function m(e){return e.createDefaultXRExperienceAsync()}async function A(e){e.baseExperience.featuresManager.enableFeature(c.WebXRFeatureName.POINTER_SELECTION,"stable",{xrInput:e.input,enablePointerSelectionOnAllControllers:!0})}async function B(e,n){const t=e.baseExperience.featuresManager;let r;if(n instanceof Function)r=n();else{if(!n||0===n.length){const t=e.baseExperience.sessionManager.scene;n=[c.MeshBuilder.CreateGround("ground",{width:400,height:400},t)]}r=n}t.enableFeature(c.WebXRFeatureName.TELEPORTATION,"stable",{xrInput:e.input,floorMeshes:r,snapPositions:[]})}async function O(e,n,t="leftHand",r="rightHand"){const o=e.baseExperience.featuresManager;if(c.WebXRFeaturesManager.GetAvailableFeatures().find((e=>e===c.WebXRFeatureName.HAND_TRACKING))){const a=o.enableFeature(c.WebXRFeatureName.HAND_TRACKING,"latest",{xrInput:e.input});a.onHandAddedObservable.add((e=>{console.log("HAND ADDED",e),"left"===e.xrController.inputSource.handedness&&n(e,t),"right"===e.xrController.inputSource.handedness&&n(e,r)})),a.onHandRemovedObservable.add((e=>{console.log("HAND REMOVED",e),"left"===e.xrController.inputSource.handedness&&n(void 0,t),"right"===e.xrController.inputSource.handedness&&n(void 0,r)}))}}async function E(e,n,t){const r=e.getScene().onPointerObservable.add((o=>{if(o.type===c.PointerEventTypes.POINTERDOWN&&o.pickInfo.hit){let a=o.pickInfo.pickedMesh,i=o.event.pointerId;a===e&&(n(i,r),t(o))}}))}async function N(e,n,t){e.getScene().onPointerObservable.add((e=>{if(e.type===c.PointerEventTypes.POINTERUP){let r=e.event.pointerId;n(r)&&t(r)}}))}window.STFB={core:n,stdlib:t,inject(e){e=e||window,Object.assign(e,n),Object.assign(e,t)}}})();
//# sourceMappingURL=bundle.js.map