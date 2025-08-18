// useTrailTexture.js
import { useMemo, useRef } from "react";
import {
  HalfFloatType,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderTarget,
} from "three";
import { useFrame, useThree } from "@react-three/fiber";
import trailFragmentShader from "./shaders/trailFragmentShader.glsl";
import trailVertexShader from "./shaders/trailVertexShader.glsl";

export function useTrailTexture({ displacementMap, fade = 0.95 }) {
  const { gl } = useThree();
  const scene = useMemo(() => new Scene(), []);
  const camera = useMemo(() => new OrthographicCamera(-1, 1, 1, -1, 0, 1), []);

  // Use a resolution that matches the canvas size for accuracy
  const resolution = useMemo(
    () =>
      new Vector2(displacementMap.image.width, displacementMap.image.height),
    [displacementMap.image.width, displacementMap.image.height],
  );

  // Create two render targets to ping-pong between
  const renderTargets = useMemo(() => {
    const options = { type: HalfFloatType }; // HalfFloat for precision
    return {
      read: new WebGLRenderTarget(resolution.x, resolution.y, options),
      write: new WebGLRenderTarget(resolution.x, resolution.y, options),
    };
  }, [resolution]);

  const trailMaterial = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: {
          uPreviousFrame: { value: null },
          uDisplacementMap: { value: displacementMap }, // Pass your map here
          uMouse: { value: new Vector2(0.5, 0.5) },
          uResolution: { value: resolution },
          uFade: { value: fade },
        },
        vertexShader: trailVertexShader,
        fragmentShader: trailFragmentShader,
      }),
    [resolution, fade, displacementMap],
  );

  const quad = useMemo(
    () => new Mesh(new PlaneGeometry(2, 2), trailMaterial),
    [trailMaterial],
  );
  scene.add(quad);

  const mouseRef = useRef(new Vector2(0.5, 0.5));

  useFrame(() => {
    trailMaterial.uniforms.uMouse.value.copy(mouseRef.current);
    trailMaterial.uniforms.uPreviousFrame.value = renderTargets.read.texture;

    // Render the scene to the "write" buffer
    gl.setRenderTarget(renderTargets.write);
    gl.render(scene, camera);
    gl.setRenderTarget(null); // Unset render target

    // Swap buffers for the next frame
    let temp = renderTargets.read;
    renderTargets.read = renderTargets.write;
    renderTargets.write = temp;
  });

  return {
    // This texture is now the dynamic, trailed version of your displacement map
    texture: renderTargets.read.texture,
    updateMouse: (x, y) => {
      mouseRef.current.set(x, y);
    },
  };
}
