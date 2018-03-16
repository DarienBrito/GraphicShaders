#version 330 compatibility

in vec3  vMCposition;
in vec4  vColor;
in float vLightIntensity; 

layout(location=0) out vec4 fFragColor;

uniform sampler3D Noise3;
uniform float uMin, uMax;
uniform float uScale;

void main( )
{
	vec4  nv  = texture3D( Noise3, uScale*vMCposition );

	float size = nv[0] + nv[1] + nv[2] + nv[3];
	size = .5 * ( size - 1. );
	// size = size * size * size;
	// float a = smoothstep( uMin, uMax, size );

	if( size < uMin )
		discard;

	if( size > uMax )
		discard;

	fFragColor = vec4( vLightIntensity*vColor.rgb, 1. );
}
