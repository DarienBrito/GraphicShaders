#version 330 compatibility

void main( )
{
	gl_Position = uModelViewMatrix * aVertex;
}
