#version 330 compatibility

out vec3  vRefractVector;
out vec3  vReflectVector;

uniform float uEta;

void main( )
{
	vec3 ECposition = vec3( uModelViewMatrix * aVertex );

	vec3 eyeDir = normalize( ECposition );			// vector from eye to pt
    	vec3 normal = normalize( uNormalMatrix * aNormal );
	vRefractVector = refract( eyeDir, normal, uEta );
	vReflectVector = reflect( eyeDir, normal );
		
	gl_Position = uModelViewProjectionMatrix * aVertex;
}
