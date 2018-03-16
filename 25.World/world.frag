#version 330 compatibility

uniform float uBlend;
uniform float uOffsetS, uOffsetT;
uniform float uFrequency;
uniform sampler2D uTexUnit;

in vec4  vColor;
in float vLightIntensity; 
in vec2  vST;

layout(location=0) out vec4 fFragColor;

void main( )
{
	float s = vST.s;
	float t = vST.t;

	float sf = fract( s * uFrequency + uOffsetS );
	float tf = fract( t * uFrequency + uOffsetT );

	vec3 newcolor = texture2D( uTexUnit, vec2(sf,tf) ).rgb;
	newcolor = mix( newcolor, vColor.rgb, uBlend );
	fFragColor = vec4( vLightIntensity*newcolor, 1. );
}
