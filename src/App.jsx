import { Canvas, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { BackgroundPlane } from "./BackgroundPlane";

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
      className="min-h-screen w-full bg-[#acacac]"
      style={{
        height: containerHeight,
      }}
    >
      {/* Canvas fills wrapper */}
      <Canvas
        className="h-full w-full"
        orthographic
        camera={{ position: [0, 0, 5], near: -100 }}
      >
        <ambientLight intensity={0.5} color={"white"} />
        <directionalLight position={[0, 0, 10]} color={"white"} castShadow />
        <BackgroundPlane
          displacementMap={displacementMap}
          normalMap={normalMap}
          aoMap={aoMap}
        />
      </Canvas>
    </div>
  );
}
