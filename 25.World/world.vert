#version 330 compatibility

out vec4  vColor;
out float vLightIntensity; 
out vec2  vST;

const vec3 LIGHTPOS = vec3( 5., 10., 10. );

void main( )
{
	vST = aTexCoord0.st;

    	vec3 tnorm = normalize( uNormalMatrix * aNormal );
	vec3 ECposition = vec3( uModelViewMatrix * aVertex );
    	vLightIntensity  = max( abs( dot( normalize(LIGHTPOS - ECposition), tnorm ) ), 0.2 );
		
	vColor = aColor;
	gl_Position = uModelViewProjectionMatrix * aVertex;
}
