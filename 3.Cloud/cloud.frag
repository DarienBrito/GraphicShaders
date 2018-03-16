#version 330 compatibility

in vec3  vMCposition;
in float vLightIntensity;

layout(location=0) out vec4 fFragColor;

uniform vec4 uSkyColor;
uniform vec4 uCloudColor;
uniform float uBias;
uniform sampler3D Noise3;

void main( )
{
    vec4  nv  = texture3D( Noise3, vMCposition );

    float intensity = ( nv[0] + nv[1] + nv[2] + nv[3] - 1. ) / 2.;

    vec3 color   = mix( uSkyColor.rgb, uCloudColor.rgb, clamp( uBias+intensity, 0., 1. ) ) * vLightIntensity;

    fFragColor = vec4(color, 1.0);
}
