#version 330 compatibility

out vec3  vMCposition;
out float vLightIntensity; 
out vec2  vST;

const vec3 LIGHTPOS = vec3( 0., 0., 10. );

void
main( )
{
	vST = aTexCoord0.st;
	vec3 tnorm  = normalize( vec3( uNormalMatrix * aNormal ) );
	vec3 ECposition = vec3( uModelViewMatrix * aVertex );
	vLightIntensity  = abs( dot( normalize(LIGHTPOS - ECposition), tnorm ) );

	vMCposition = aVertex.xyz;
	gl_Position = uModelViewProjectionMatrix * aVertex;
}
