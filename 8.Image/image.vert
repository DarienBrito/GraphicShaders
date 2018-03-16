#version 330 compatibility

out vec2 vST;

void main( )
{
	vST  = aTexCoord0.st;
	gl_Position = uModelViewProjectionMatrix * aVertex;
}
