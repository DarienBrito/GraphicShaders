#version 330 compatibility

out vec3	vMCposition;
out vec3	vECposition;
out vec2	vST;

void main( ) 
{
	vST = aTexCoord0.st;
	vMCposition = aVertex.xyz;
	vECposition = ( uModelViewMatrix * aVertex ).xyz;
	gl_Position = uModelViewProjectionMatrix * aVertex;
}
