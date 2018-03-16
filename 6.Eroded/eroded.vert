#version 330 compatibility

out vec4  vColor;
out vec3  vMCposition;
out float vLightIntensity; 

const vec3 LIGHTPOS = vec3( 3., 5., 10. );

void main( )
{
    	vec3 tnorm      = normalize( vec3( uNormalMatrix * aNormal ) );
	vec3 ECposition = vec3( uModelViewMatrix * aVertex );
    	vLightIntensity  = abs( dot( normalize(LIGHTPOS - ECposition), tnorm ) );

	vColor = aColor;
	vMCposition = vec3( aVertex );
	gl_Position     = uModelViewProjectionMatrix * aVertex;
}
