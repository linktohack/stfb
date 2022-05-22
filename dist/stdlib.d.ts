/**
 * @packageDocumentation Super Tiny Foundation for BABYLON, stdlib
 * @author Quang-Linh LE
 */
import * as BABYLON from "babylonjs";
import { IEntity } from "./core";
/**
 * Compnent: Enable physics for `scene'
 * @param scene
 */
export declare function enablePhysics(scene: BABYLON.Scene): Promise<void>;
/**
 * Component: With physics enabled on scene, enable it for mesh `el'
 * @param el
 * @param mass
 * @param restitution
 */
export declare function withPhysics(el: BABYLON.Mesh, mass: number, restitution: number): void;
/**
 * Component: Enable debug for scene
 * @param scene
 */
export declare function enableDebug(scene: BABYLON.Scene): Promise<void>;
export declare function withPBRMatByColor(el: BABYLON.Mesh, color: string): void;
export declare function withRedMat(el: BABYLON.Mesh): void;
export declare function withGreenMat(el: BABYLON.Mesh): void;
export declare function withBlueMat(el: BABYLON.Mesh): void;
export declare function withYellowMat(el: BABYLON.Mesh): void;
/**
 * Entity: Add XR on `scene'
 * @param scene
 */
export declare function XR(scene: any): Promise<any>;
/**
 * Enable Pointer Selection
 *
 * A Component for `xrHelper`
 * @param xrHelper
 */
export declare function withPointerSelection(xrHelper: BABYLON.WebXRDefaultExperience): Promise<void>;
/**
 * Enable Teleportation
 *
 * A Component for `xrHelper`
 * @param xrHelper
 * @param floors
 */
export declare function withTeleportation(xrHelper: BABYLON.WebXRDefaultExperience, floors: BABYLON.Mesh[] | Function | undefined): Promise<void>;
/**
 * Enable handtracking
 *
 * A Component for `xrHelper`
 * @param xrHelper
 * @param setElForId
 * @param leftHandId
 * @param rightHandId
 */
export declare function withHandTracking(xrHelper: BABYLON.WebXRDefaultExperience, setElForId: Function, leftHandId?: string, rightHandId?: string): Promise<void>;
/**
 * Component: Action when the mesh has been pick (but not neccessary release)
 * @param el
 * @param setElForId
 * @param cb
 */
export declare function onPickedDown(el: BABYLON.Mesh, setElForId: Function, cb: Function): Promise<void>;
/**
 * Component: Action when mesh has been release, should work only when `onPickedDown` is also set
 * @param el
 * @param findElById
 * @param cb
 */
export declare function onPickedUp(el: BABYLON.Mesh, findElById: Function, cb: Function): Promise<void>;
/**
 * Replace an entity with a new `fn`, while preseve the `components` and `children`
 *
 * Only work with HMR enabled (or `module.hot` is truthy)
 * @param el
 * @returns
 */
export declare function replaceEntity(el: IEntity, newElFn: (scene: BABYLON.Scene) => IEntity | Promise<IEntity>): Promise<void>;
