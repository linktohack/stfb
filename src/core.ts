/**
 * @packageDocumentation Super Tiny Foundation for BABYLON, enables ECS principle on BABYLON scenes
 * @author Quang-Linh LE
 *
 * System: Global state
 * Components: Functions that take `entity' as its first argument,
 *   enhances, modifies its behavior in some ways
 * Entity: Node, Mesh, Feature etc..
 */

import * as BABYBLON from 'babylonjs';

/**
 * Bootstrap a new system with a `registry'
 *
 * @param registry global state
 * @returns [setElForId, findElById]
 */
export function System(registry) {
  return {
    setElForId(el, id) {
      if (registry[id] && registry[id] !== el) {
        throw new Error(
          `Id \`${id}' is already reserved for \'${registry[id]}'`
        );
      } else if (el === undefined) {
        delete registry[id];
      } else {
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
export async function Scene<T extends BABYLON.Node>(
  sceneOrCanvas: BABYLON.Scene | HTMLCanvasElement | null,
  {
    components,
    children,
  }: {
    components?: (
      | ((scene: BABYLON.Scene) => void | Promise<void>)
      | ((scene: BABYLON.Scene, ...args) => void | Promise<void>)
      | [Function, ...any]
    )[];
    children?: ((scene: BABYLON.Scene) => Promise<T>)[];
  }
): Promise<BABYLON.Scene> {
  let canvas: HTMLCanvasElement;
  let engine: BABYLON.Engine;
  let scene: BABYLON.Scene;

  // Do we need a default scene?

  if (sceneOrCanvas instanceof BABYLON.Scene) {
    scene = sceneOrCanvas;
    engine = scene.getEngine();
    canvas = engine.getRenderingCanvas();
  } else {
    canvas =
      sceneOrCanvas instanceof HTMLCanvasElement
        ? sceneOrCanvas
        : document.createElement("canvas");
    canvas.style.cssText = "width: 100%; height: 100%; touch-action: none;";
    document.body.appendChild(canvas);

    engine = new BABYLON.Engine(canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
      disableWebGL2Support: false,
    });

    scene = new BABYLON.Scene(engine);
  }

  for (const component of components || []) {
    if (Array.isArray(component)) {
      const [fn, ...args] = component;
      fn(scene, ...args);
    } else {
      await component(scene);
    }
  }

  const childEls = await Promise.all(
    (children || []).map((childFn) => childFn(scene))
  );

  // Do we need a default light?
  let light = childEls.find(
    (el) => el instanceof BABYLON.Light
  ) as BABYLON.Light;
  if (!light) {
    light = CreateDefaultLight(scene);
  }

  // Do we need a default camera?
  let camera = childEls.find(
    (el) => el instanceof BABYLON.Camera
  ) as BABYLON.Camera;
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
export function Entity<T>(
  fn: (scene: BABYLON.Scene) => T | Promise<T>,
  {
    components,
    children,
  }: {
    components?: (
      | ((el: T) => void | Promise<void>)
      | ((el: T, ...args) => void | Promise<void>)
      | [(el: T, ...args) => void | Promise<void>, ...any]
    )[];
    children?: ((scene: BABYLON.Scene) => Promise<T & { parent: any }>)[]; // super of T?
  } = { components: [], children: [] }
) {
  return async (scene: BABYLON.Scene) => {
    const el = await fn(scene);

    for (const component of components || []) {
      if (Array.isArray(component)) {
        const [fn, ...args] = component;
        fn(el, ...args);
      } else {
        await component(el);
      }
    }

    for (const childFn of children || []) {
      let childEl = await childFn(scene);
      if (Array.isArray(childEl)) {
        for (const c of childEl) {
          c.parent = el;
        }
      } else {
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
export function CreateDefaultLight(scene: BABYLON.Scene) {
  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );

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
export function CreateDefaultCamera(scene: BABYLON.Scene) {
  // This creates and positions a free camera (non-mesh)
  const camera = new BABYLON.FreeCamera(
    "camera",
    new BABYLON.Vector3(0, 5, -10),
    scene
  );

  // This targets the camera to scene origin
  camera.setTarget(BABYLON.Vector3.Zero());

  // This attaches the camera to the canvas
  camera.attachControl(scene.getEngine().getRenderingCanvas(), true);
  return camera;
}