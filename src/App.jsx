import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { TextureLoader } from "three";
import { useEffect } from "react";

function BackgroundPlane({ map, displacementMap, normalMap, aoMap }) {
  const { viewport, camera } = useThree();
  const aspect = displacementMap.image.height / displacementMap.image.width;
  const width = viewport.width;
  const height = width * aspect;

  // adjust camera zoom so plane fills viewport height
  useEffect(() => {
    camera.zoom = viewport.height / height;
    camera.updateProjectionMatrix();
  }, [camera, viewport.height, height]);

  return (
    <mesh scale={[width, height, 1]}>
      <planeGeometry args={[1, 1, 128, 128]} />
      <meshPhysicalMaterial
        color="white"
        roughness={0.4}
        map={map}
        displacementMap={displacementMap}
        displacementScale={0.2}
        normalMap={normalMap}
        aoMap={aoMap}
      />
    </mesh>
  );
}

export default function App() {
  // loads before first render (suspense), so image is available
  const displacementMap = useLoader(TextureLoader, "displacement-map.png");
  const normalMap = useLoader(TextureLoader, "normal-map.png");
  const aoMap = useLoader(TextureLoader, "ao-map.png");

  // compute CSS height for the Canvas container so it keeps the image aspect ratio
  const aspect = displacementMap.image
    ? displacementMap.image.height / displacementMap.image.width
    : 1;
  const containerHeight = `${aspect * 100}vw`; // = (h/w) * 100vw

  return (
    // this wrapper becomes as tall as the texture aspect ratio requires.
    // if containerHeight > 100vh page becomes scrollable.
    <div
      className="min-h-screen w-full bg-[#c2c2c2]"
      style={{
        height: containerHeight,
      }}
    >
      {/* Canvas fills wrapper */}
      <Canvas
        className="h-full w-full"
        orthographic
        camera={{ position: [0, 0, 5], zoom: 1 }}
      >
        <ambientLight intensity={0.5} color={"white"} />
        <directionalLight position={[0, 0, 10]} color={"white"} castShadow />
        <BackgroundPlane
          // map={map}
          displacementMap={displacementMap}
          normalMap={normalMap}
          aoMap={aoMap}
        />
      </Canvas>
    </div>
  );
}
