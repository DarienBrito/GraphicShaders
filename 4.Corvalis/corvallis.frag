#version 330 compatibility

in vec4	vColor;

layout(location=0) out vec4 fFragColor;

void
main( )
{
	fFragColor = vColor;
}
