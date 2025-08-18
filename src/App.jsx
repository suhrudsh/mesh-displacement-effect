// App.js
import { Canvas, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { BackgroundPlane } from "./BackgroundPlane";

export default function App() {
  const displacementMap = useLoader(TextureLoader, "displacement-map.png");
  const aoMap = useLoader(TextureLoader, "ao-map.png");

  return (
    <>
      <div className="fixed top-0 left-0 -z-10 h-lvh w-screen">
        <Canvas
          className="h-full w-full touch-pan-y"
          orthographic
          camera={{ position: [0, 0, 5], near: -100 }}
        >
          <ambientLight intensity={0.5} color={"white"} />
          <directionalLight position={[0, 0, 10]} color={"white"} castShadow />
          <BackgroundPlane displacementMap={displacementMap} aoMap={aoMap} />
        </Canvas>
      </div>

      <div className="h-[200vh] w-full">
        {/* Your foreground content (text, images, etc.) goes here */}
      </div>
    </>
  );
}
