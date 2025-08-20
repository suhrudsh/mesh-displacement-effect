// BackgroundPlane.js
import { useFrame, useThree } from "@react-three/fiber";
import {
  MeshPhysicalMaterial,
  Vector2,
  Raycaster,
  MeshBasicMaterial,
} from "three";
import CustomShaderMaterial from "three-custom-shader-material";
import vertexShader from "./shaders/vertexShader.glsl";
import fragmentShader from "./shaders/fragmentShader.glsl";
import { useRef, useMemo } from "react";
import { useTrailTexture } from "./useTrailTexture";
import { TouchTracker } from "./TouchTracker";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export function BackgroundPlane({ displacementMap, aoMap }) {
  const { viewport, camera } = useThree();
  const interactionPlaneRef = useRef();
  const materialRef = useRef();
  const pointerRef = useRef(new Vector2(0.5, 0.5));

  const { texture: trailMap, updateMouse } = useTrailTexture({
    displacementMap,
    fade: 0.96,
  });

  const planeDimensions = useMemo(() => {
    const aspect = displacementMap.image.height / displacementMap.image.width;
    const width = viewport.width;
    const height = width * aspect;
    return { width, height };
  }, [viewport, displacementMap]);

  useGSAP(() => {
    const cameraStartY = planeDimensions.height / 2 - viewport.height / 2;
    const cameraEndY = -planeDimensions.height / 2 + viewport.height / 2;
    camera.position.y = cameraStartY;
    gsap.to(camera.position, {
      y: cameraEndY,
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });
  }, [planeDimensions, viewport]);

  useFrame((state) => {
    // 1. Get the mouse in [0, 1] space from TouchTracker (origin is canvas bottom-left)
    const canvasMouse = pointerRef.current;

    // 2. Calculate the world position of the visible part of the plane
    const visiblePlaneBottom =
      state.camera.position.y - state.viewport.height / 2;
    const visiblePlaneHeight = state.viewport.height;

    // 3. Map the mouse's Y coordinate to the visible area
    //    `canvasMouse.y` (0 to 1) maps to `worldY` (bottom to top of viewport)
    const worldY = visiblePlaneBottom + canvasMouse.y * visiblePlaneHeight;

    // 4. Convert this world Y position to the entire plane's UV space
    const uvY = (worldY + planeDimensions.height / 2) / planeDimensions.height;

    // 5. The shader expects a top-down coordinate. Flip the final UV coordinate.
    const finalX = canvasMouse.x;
    const finalY = uvY;

    // 6. Pass the definitive coordinates to the shaders
    updateMouse(finalX, finalY);
    materialRef.current.uniforms.uMouse.value.set(finalX, finalY);
    materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
  });

  return (
    <>
      <TouchTracker pointerRef={pointerRef} />
      <group>
        <mesh ref={interactionPlaneRef}>
          <planeGeometry
            args={[planeDimensions.width, planeDimensions.height, 1, 1]}
          />
          <meshBasicMaterial visible={false} />
        </mesh>

        <mesh>
          <planeGeometry
            args={[planeDimensions.width, planeDimensions.height, 768, 768]}
          />
          <CustomShaderMaterial
            ref={materialRef}
            baseMaterial={MeshPhysicalMaterial}
            color="#ffffff"
            roughness={0.4}
            aoMap={aoMap}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={{
              uDisplacementMap: { value: trailMap },
              uDisplacementScale: { value: 45.0 },
              uMouse: { value: new Vector2(0.5, 0.5) },
              uTime: { value: 0 },
              uResolution: {
                value: new Vector2(
                  displacementMap.image.width,
                  displacementMap.image.height,
                ),
              },
              // ... other uniforms
            }}
          />
        </mesh>
      </group>
    </>
  );
}
