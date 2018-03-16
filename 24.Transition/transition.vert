#version 330 compatibility

out vec3 vMCposition;
out vec2 vST;

void main( )
{
	vMCposition     = aVertex.xyz;
	vST             = aTexCoord0.st;
	gl_Position     = uModelViewProjectionMatrix * aVertex;
}
