#version 330 compatibility

uniform float uMix;
uniform samplerCube uReflectUnit;
uniform samplerCube uRefractUnit;

in float vLightIntensity; 
in vec3  vReflectVector;
in vec3  vRefractVector;

layout(location=0) out vec4 fFragColor;

const vec4 WHITE = vec4( 1.,1.,1.,1. );

void main( )
{

	vec4 refractcolor = textureCube( uRefractUnit, vRefractVector );
	vec4 reflectcolor = textureCube( uReflectUnit, vReflectVector );
	refractcolor = mix( refractcolor, WHITE, .3 );
	fFragColor = mix( refractcolor, reflectcolor, uMix );
}
