/**
 * @packageDocumentation Super Tiny Foundation for BABYLON, enables ECS principle on BABYLON scenes
 * @author Quang-Linh LE
 *
 * System: Global state
 * Components: Functions that take `entity' as its first argument,
 *   enhances, modifies its behavior in some ways
 * Entity: Node, Mesh, Feature etc..
 */
import * as BABYLON from 'babylonjs';
/**
 * Bootstrap a new system with a `registry'
 *
 * @param registry global state
 * @returns [setElForId, findElById]
 */
export declare function System(registry: any): {
    setElForId(el: any, id: any): void;
    findElById(id: any): any;
};
/**
 * Bootstrap a scene
 * @param sceneOrCanvas
 * @param param1
 * @returns
 */
export declare function Scene<T extends BABYLON.Node>(sceneOrCanvas: BABYLON.Scene | HTMLCanvasElement | null, { components, children, }: {
    components?: (((scene: BABYLON.Scene) => void | Promise<void>) | ((scene: BABYLON.Scene, ...args: any[]) => void | Promise<void>) | [Function, ...any])[];
    children?: ((scene: BABYLON.Scene) => Promise<T>)[];
}): Promise<BABYLON.Scene>;
/**
 * Entity is basically a Mesh or a Feature that its behavior can be modified by some functions (Components)
 * and may have children that are also Entities
 * @param fn
 * @param param1
 * @returns
 */
export declare function Entity<T>(fn: (scene: BABYLON.Scene) => T | Promise<T>, { components, children, }?: {
    components?: (((el: T) => void | Promise<void>) | ((el: T, ...args: any[]) => void | Promise<void>) | [(el: T, ...args: any[]) => void | Promise<void>, ...any])[];
    children?: ((scene: BABYLON.Scene) => Promise<T & {
        parent: any;
    }>)[];
}): (scene: BABYLON.Scene) => Promise<T>;
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
