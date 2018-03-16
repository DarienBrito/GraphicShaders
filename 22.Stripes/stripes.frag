#version 330 compatibility

uniform float uA;
uniform float uP;
uniform float uTol;

in float vX, vY;
in vec4  vColor;
in float vLightIntensity; 

layout(location=0) out vec4 fFragColor;

const vec4 WHITE = vec4( 1., 1., 1., 1. );

void
main( )
{
	float f = fract( uA*vX );
	
	float t = smoothstep( 0.5-uP-uTol, 0.5-uP+uTol, f )  -  smoothstep( 0.5+uP-uTol, 0.5+uP+uTol, f );
	fFragColor = mix( WHITE, vColor, t );
	fFragColor.rgb *= vLightIntensity;
}
