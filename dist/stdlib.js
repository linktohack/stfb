/**
 * @packageDocumentation Super Tiny Foundation, stdlib
 * @author Quang-Linh LE
 */
// Physics
import * as BABYLON from 'babylonjs';
/**
 * Compnent: Enable physics for `scene'
 * @param scene
 */
export async function enablePhysics(scene) {
    scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.AmmoJSPlugin());
}
/**
 * Component: With physics enabled on scene, enable it for mesh `el'
 * @param el
 * @param mass
 * @param restitution
 */
export function withPhysics(el, mass, restitution) {
    const physicsImpostor = new BABYLON.PhysicsImpostor(el, BABYLON.PhysicsImpostor.SphereImpostor, { mass, restitution }, el.getScene());
    el.physicsImpostor = physicsImpostor;
}
// Debug
/**
 * Component: Enable debug for scene
 * @param scene
 */
export async function enableDebug(scene) {
    scene.debugLayer.show();
}
// Material
export function withPBRMatByColor(el, color) {
    const mat = new BABYLON.PBRMaterial("blue", el.getScene());
    mat.albedoColor = BABYLON.Color3.FromHexString(color);
    mat.metallic = 0.99;
    mat.roughness = 0.01;
    el.material = mat;
}
export function withRedMat(el) {
    return withPBRMatByColor(el, "#EF2D5E");
}
export function withGreenMat(el) {
    return withPBRMatByColor(el, "#7BC8A4");
}
export function withBlueMat(el) {
    return withPBRMatByColor(el, "#4CC3D9");
}
export function withYellowMat(el) {
    return withPBRMatByColor(el, "#FFC65D");
}
// XR
/**
 * Entity: Add XR on `scene'
 * @param scene
 */
export async function XR(scene) {
    return scene.createDefaultXRExperienceAsync();
}
/**
 * Enable Pointer Selection
 *
 * A Component for `xrHelper`
 * @param xrHelper
 */
export async function withPointerSelection(xrHelper) {
    const featuresManager = xrHelper.baseExperience.featuresManager;
    featuresManager.enableFeature(BABYLON.WebXRFeatureName.POINTER_SELECTION, "stable", {
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
export async function withTeleportation(xrHelper, floors) {
    const featuresManager = xrHelper.baseExperience.featuresManager;
    let floorMeshes;
    if (floors instanceof Function) {
        floorMeshes = floors();
    }
    else {
        if (!floors || floors.length === 0) {
            const scene = xrHelper.baseExperience.sessionManager.scene;
            const ground = BABYLON.MeshBuilder.CreateGround("ground", {
                width: 400,
                height: 400,
            }, scene);
            floors = [ground];
        }
        floorMeshes = floors;
    }
    featuresManager.enableFeature(BABYLON.WebXRFeatureName.TELEPORTATION, "stable", {
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
export async function withHandTracking(xrHelper, setElForId, leftHandId = "leftHand", rightHandId = "rightHand") {
    const featuresManager = xrHelper.baseExperience.featuresManager;
    const availableFeatures = BABYLON.WebXRFeaturesManager.GetAvailableFeatures();
    if (availableFeatures.find((it) => it === BABYLON.WebXRFeatureName.HAND_TRACKING)) {
        const xrHandFeature = featuresManager.enableFeature(BABYLON.WebXRFeatureName.HAND_TRACKING, "latest", {
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
export async function onPickedDown(el, setElForId, cb) {
    const scene = el.getScene();
    // FIXME(QL): How to cleanup?
    const observer = scene.onPointerObservable.add((pointerInfo) => {
        switch (pointerInfo.type) {
            case BABYLON.PointerEventTypes.POINTERDOWN:
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
export async function onPickedUp(el, findElById, cb) {
    const scene = el.getScene();
    // FIXME(QL): How to cleanup?
    const observer = scene.onPointerObservable.add((pointerInfo) => {
        switch (pointerInfo.type) {
            case BABYLON.PointerEventTypes.POINTERUP:
                let pointerId = pointerInfo.event.pointerId;
                if (findElById(pointerId)) {
                    cb(pointerId);
                }
                break;
        }
    });
}
//# sourceMappingURL=stdlib.js.map