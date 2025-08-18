// vertexShader.glsl
uniform sampler2D uDisplacementMap; // This will be our dynamic trailMap
uniform float uDisplacementScale;

varying vec2 vUv;

void main() {
    vUv = uv;

    // The displacement value is read directly from our generated trail texture.
    // This texture already contains the displacement data from your original map,
    // revealed by the mouse, with a fading trail.
    float displacement = texture2D(uDisplacementMap, vUv).r;

    vec3 displacedPosition = position + normal * displacement * uDisplacementScale;

    csm_Position = displacedPosition;
}