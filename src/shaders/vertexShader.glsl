uniform sampler2D uDisplacementMap;
uniform float uDisplacementScale;
uniform vec2 uMouse;

varying vec2 vUv;

void main() {
    vUv = uv;

    float dist = distance(vUv, uMouse);
    float mask = smoothstep(0.075, 0.0, dist);

    float displacement = texture2D(uDisplacementMap, vUv).r;

    vec3 displacedPosition = position + normal * displacement * uDisplacementScale * mask; // Adjust the multiplier for more or less displacement

    csm_Position = displacedPosition;
    csm_Normal = normal;
}