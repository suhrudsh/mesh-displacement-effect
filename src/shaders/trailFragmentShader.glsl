uniform sampler2D uPreviousFrame;
uniform sampler2D uDisplacementMap; // Your original displacement map
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform float uFade;

varying vec2 vUv;

void main() {
    // Get the color/value from the previous frame
    vec4 previousColor = texture2D(uPreviousFrame, vUv);

    // Fade the previous frame's data over time
    previousColor.rgb *= uFade;

    // Create a circular brush mask at the mouse position
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    float dist = length((vUv - uMouse) * aspect);
    float brushMask = smoothstep(0.075, 0.0, dist); // Soft circular brush

    // Sample the displacement value from your original map
    float displacementValue = texture2D(uDisplacementMap, vUv).r;

    // Create the new "paint" stroke by applying the brush mask to the displacement value
    vec3 newPaint = vec3(displacementValue * brushMask);

    // Combine the faded trail with the new paint stroke.
    // max() ensures the trail holds the shape of the displacement map
    // and doesn't just become a faded white blob.
    vec3 finalColor = max(previousColor.rgb, newPaint);

    gl_FragColor = vec4(finalColor, 1.0);
}