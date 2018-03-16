#version 400 core

uniform float uLightX, uLightY, uLightZ;
uniform float uKa, uKd;
uniform bool  uFlat;
uniform vec4  uColor;


flat in vec3 gNormalF;
     in vec3 gNormalS;
     in vec3 gPosition;

layout(location=0) out vec4 FragColor;

void main( )
{
	vec3 lightPos = vec3( uLightX, uLightY, uLightZ );
	float lightIntensity  = dot( normalize( lightPos - gPosition ), uFlat ? gNormalF : gNormalS );
	FragColor = vec4(  ( uKa + uKd*lightIntensity ) * uColor.rgb, 1.  );
}
