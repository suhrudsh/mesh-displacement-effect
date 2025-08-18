import { useFrame, useThree } from "@react-three/fiber";
import { MeshPhysicalMaterial, Vector2 } from "three";
import CustomShaderMaterial from "three-custom-shader-material";
import vertexShader from "./shaders/vertexShader.glsl";
import fragmentShader from "./shaders/fragmentShader.glsl";
import { useRef } from "react";

export function BackgroundPlane({ displacementMap, normalMap, aoMap }) {
  const { viewport } = useThree();
  const aspect = displacementMap.image.height / displacementMap.image.width;
  const width = viewport.width;
  const height = width * aspect;

  const materialRef = useRef();

  useFrame((state) => {
    // state.pointer.x/y are in [-1, 1]
    const x = (state.pointer.x + 1) / 2;
    const y = (state.pointer.y + 1) / 2;
    materialRef.current.uniforms.uMouse.value.set(x, y);
  });

  return (
    <mesh scale={[width, height, 5]}>
      <planeGeometry args={[1, 1, 256, 256]} />
      <CustomShaderMaterial
        baseMaterial={MeshPhysicalMaterial}
        color="white"
        roughness={0.4}
        normalMap={normalMap}
        aoMap={aoMap}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uDisplacementMap: { value: displacementMap },
          uDisplacementScale: { value: 15.0 },
          uAOIntensity: { value: 0.0 },
          uMouse: { value: new Vector2(0.5, 0.5) },
          uResolution: { value: new Vector2(viewport.width, viewport.height) },
        }}
        ref={materialRef}
      />
    </mesh>
  );
}
