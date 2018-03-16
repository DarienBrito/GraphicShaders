#version 330 compatibility

out vec3 vReflectVector;

const vec3 LIGHTPOS = vec3( 5., 10., 10. );

void main( )
{
	vec3 ECposition = vec3( uModelViewMatrix * aVertex );

	vec3 eyeDir = ECposition;			// vector from eye to pt
    	vec3 normal = normalize( uNormalMatrix * aNormal );
	vReflectVector = reflect( eyeDir, normal );
		
	gl_Position = uModelViewProjectionMatrix * aVertex;
}
