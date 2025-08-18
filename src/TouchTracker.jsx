import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { Vector2 } from "three";

// This is a "headless" component - it doesn't render anything.
// Its only job is to manage window events.
export function TouchTracker({ pointerRef }) {
  const { gl, size } = useThree();

  useEffect(() => {
    // A single handler for both mouse and touch events.
    const handlePointerMove = (e) => {
      // For touch events, we take the first touch.
      const touch = e.touches ? e.touches[0] : e;
      const { clientX, clientY } = touch;

      // Get the canvas position and size on the screen.
      const rect = gl.domElement.getBoundingClientRect();

      // Calculate the pointer position relative to the canvas, in pixels.
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // Update the shared ref with the normalized coordinates (0 to 1).
      // This is what our trail-generating hook expects.
      pointerRef.current.x = x / rect.width;
      pointerRef.current.y = 1.0 - y / rect.height; // Invert Y-axis
    };

    // Add event listeners to the window.
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("touchmove", handlePointerMove);

    // Cleanup function to remove listeners when the component unmounts.
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
    };
  }, [gl.domElement, size, pointerRef]); // Re-run if canvas or size changes

  return null; // Render nothing
}
