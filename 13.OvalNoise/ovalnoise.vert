#version 330 compatibility

out vec3  vMCposition;
out float vLightIntensity; 
out float vZ;
out vec2  vST;

vec3 LIGHTPOS   = vec3( -2., 0., 10. );

void
main( )
{
	vST = aTexCoord0.st;

	vec3 tnorm      = normalize( vec3( uNormalMatrix * aNormal ) );
	vec3 ECposition = vec3( uModelViewMatrix * aVertex );
	vZ = ECposition.z;
	vLightIntensity  = abs( dot( normalize(LIGHTPOS - ECposition), tnorm ) );

	vMCposition  = aVertex.xyz;
	gl_Position = uModelViewProjectionMatrix * aVertex;
}
