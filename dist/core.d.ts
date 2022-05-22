/**
 * @packageDocumentation Super Tiny Foundation for BABYLON, enables ECS principle on BABYLON scenes
 * @author Quang-Linh LE
 *
 * System: Global state
 * Components: Functions that take `entity' as its first argument,
 *   enhances, modifies its behavior in some ways
 * Entity: Node, Mesh, Feature etc..
 */
import * as BABYLON from "babylonjs";
export declare type IEntity = BABYLON.Node | BABYLON.Camera | BABYLON.WebXRDefaultExperience;
/**
 * Bootstrap a new system with a `registry'
 *
 * @param registry global state
 * @param opt optional { noUniqueCheck: false }
 * @returns { setElForId, findElById }
 */
export declare function System(registry: any, opt?: {
    noUniqueCheck: boolean;
}): {
    setElForId(el: any, id: any): void;
    findElById(id: any): any;
};
/**
 * Bootstrap a scene
 * @param sceneOrCanvas
 * @param param1
 * @returns
 */
export declare function Scene(sceneOrCanvas: BABYLON.Scene | HTMLCanvasElement | null, { components, children, }: {
    components?: (((scene: BABYLON.Scene) => void | Promise<void>) | ((scene: BABYLON.Scene, ...args: any[]) => void | Promise<void>) | [Function, ...any])[];
    children?: ((scene: BABYLON.Scene) => Promise<IEntity>)[];
}): Promise<BABYLON.Scene>;
/**
 * Entity is basically a Mesh or a Feature that its behavior can be modified by some functions (Components)
 * and may have children that are also Entities
 * @param fn
 * @param param1
 * @returns
 */
export declare function Entity(fn: (scene: BABYLON.Scene) => IEntity | Promise<IEntity>, { components, children, }?: {
    components?: (((el: IEntity) => void | Promise<void>) | ((el: IEntity, ...args: any[]) => void | Promise<void>) | [(el: IEntity, ...args: any[]) => void | Promise<void>, ...any])[];
    children?: ((scene: BABYLON.Scene) => Promise<IEntity & {
        parent: any;
    }>)[];
}): (scene: BABYLON.Scene) => Promise<IEntity>;
/**
 * Create a default Light for `scene` (if not exist)
 *
 * A `Component` for `scene`
 * @param scene
 * @returns
 */
export declare function CreateDefaultLight(scene: BABYLON.Scene): BABYLON.HemisphericLight;
/**
 * Create a default Camera for `scene` (if not exist)
 *
 * A `Component` for `scene`
 * @param scene
 * @returns
 */
export declare function CreateDefaultCamera(scene: BABYLON.Scene): BABYLON.FreeCamera;
