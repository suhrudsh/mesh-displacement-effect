varying vec2 vUv;

uniform sampler2D uDisplacementMap;
uniform float uAOIntensity;

void main() {
    // Recalculate normals for correct lighting on the displaced surface.
    vec3 fdx = dFdx(vViewPosition);
    vec3 fdy = dFdy(vViewPosition);
    vec3 newNormal = normalize(cross(fdx, fdy));
    csm_FragNormal = newNormal;

    // Sample the base AO color from your texture.
    float ao = texture2D(aoMap, vUv).r;

    float trailMask = texture2D(uDisplacementMap, vUv).r;

    csm_AO = mix(1.0, ao, trailMask * uAOIntensity);
}