import { useFrame, useThree } from "@react-three/fiber";
import { MeshPhysicalMaterial, Vector2 } from "three";
import CustomShaderMaterial from "three-custom-shader-material";
import vertexShader from "./shaders/vertexShader.glsl";
import fragmentShader from "./shaders/fragmentShader.glsl";
import { useRef } from "react";
import { useTrailTexture } from "./useTrailTexture"; // Import the updated hook

export function BackgroundPlane({ displacementMap, aoMap }) {
  const { viewport } = useThree();

  // Pass your displacementMap to the hook. Adjust the fade factor for a longer/shorter trail.
  const { texture: trailMap, updateMouse } = useTrailTexture({
    displacementMap,
    fade: 0.9,
  });

  // Calculate scale based on your original map's aspect ratio
  const aspect = displacementMap.image.height / displacementMap.image.width;
  const width = viewport.width;
  const height = width * aspect;

  const materialRef = useRef();

  useFrame((state) => {
    const x = (state.pointer.x + 1) / 2;
    const y = (state.pointer.y + 1) / 2;

    // This only updates the mouse position for our trail-generating hook
    updateMouse(x, y);

    // We can also pass the live mouse position to the main material for other effects (like the AO mask)
    materialRef.current.uniforms.uMouse.value.set(x, y);
    materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
  });

  return (
    <>
      <mesh scale={[width, height, 1]}>
        <planeGeometry args={[1, 1, 768, 768]} />
        <CustomShaderMaterial
          ref={materialRef}
          baseMaterial={MeshPhysicalMaterial}
          color={"white"}
          roughness={0.4}
          aoMap={aoMap}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={{
            // Use the DYNAMIC texture from our hook as the displacement map
            uDisplacementMap: { value: trailMap },
            uDisplacementScale: { value: 100 },
            uAOIntensity: { value: 1.0 },
            uMouse: { value: new Vector2(0.5, 0.5) },
            uResolution: {
              value: new Vector2(viewport.width, viewport.height),
            },
            uTime: { value: 0.0 },
          }}
        />
      </mesh>
      <mesh position={[0, 0, 0.01]} scale={[width, height, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshPhysicalMaterial color="#d6d6d6" roughness={0.4} />
      </mesh>
    </>
  );
}
