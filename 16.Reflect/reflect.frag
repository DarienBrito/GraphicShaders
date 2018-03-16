#version 330 compatibility

in vec3  vReflectVector;

layout(location=0) out vec4 fFragColor;

uniform samplerCube uReflectUnit;

void main( )
{
	fFragColor = textureCube( uReflectUnit, vReflectVector );
}
