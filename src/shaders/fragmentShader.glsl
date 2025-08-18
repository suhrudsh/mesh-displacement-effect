varying vec2 vUv;

uniform float uAOIntensity;
uniform vec2 uMouse;       // mouse in 0–1 space
uniform vec2 uResolution;  // [width, height]
uniform float uTime;

void main() {
    // Recalculate normals for displacement
    vec3 fdx = dFdx(vViewPosition);
    vec3 fdy = dFdy(vViewPosition);
    vec3 newNormal = normalize(cross(fdx, fdy));

    // Sample AO
    float ao = texture2D(aoMap, vUv).r * uAOIntensity;

    // Correct for aspect ratio so circle stays circular
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);

    // Diff between UV and mouse in aspect-corrected space
    vec2 diff = (vUv - uMouse) * aspect;
    float dist = length(diff);

    // Mask with smooth falloff
    float mask = smoothstep(0.075, 0.0, dist);

    // Apply mask to normal and AO
    csm_AO = mix(1.0, ao, mask);

    csm_FragNormal = newNormal;
}
