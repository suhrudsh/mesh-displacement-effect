varying vec2 vUv;

uniform float uAOIntensity;
uniform vec2 uMouse;       // mouse in 0–1 space
uniform vec2 uResolution;  // [width, height]

void main() {
    // Sample normal and remap
    vec3 texNormal = texture2D(normalMap, vUv).rgb;
    texNormal = normalize(texNormal * 2.0 - 1.0);

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
    csm_FragNormal = mix(vec3(0.0, 0.0, 1.0), texNormal, mask);
    csm_AO = mix(1.0, ao, mask);
}
