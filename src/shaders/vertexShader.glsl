uniform sampler2D uDisplacementMap;
uniform float uDisplacementScale;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform float uTime;

varying vec2 vUv;

void main() {
    vUv = uv;

    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);

    // Diff between UV and mouse in aspect-corrected space
    vec2 diff = (vUv - uMouse) * aspect;

    float dist = length(diff);
    float mask = smoothstep(0.075, 0.0, dist);

    float displacement = texture2D(uDisplacementMap, vUv).r;

    vec3 displacedPosition = position + normal * displacement * uDisplacementScale * mask; // Adjust the multiplier for more or less displacement

    csm_Position = displacedPosition;
    csm_Normal = normal;
}