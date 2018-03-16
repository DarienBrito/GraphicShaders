#version 330 compatibility

out float vLightIntensity; 
out vec4  vColor;
out vec2  vST;

const vec3 LIGHTPOS = vec3( 0., 0., 10. );

void
main( )
{

	vec3 tnorm = normalize( vec3( uNormalMatrix * aNormal ) );
	vec3 ECposition = vec3( uModelViewMatrix * aVertex );
	vLightIntensity  = abs( dot( normalize(LIGHTPOS - ECposition), tnorm ) );

	vColor = aColor;
	vST = aTexCoord0.st;
	gl_Position = uModelViewProjectionMatrix * aVertex;
}
