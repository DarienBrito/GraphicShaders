#version 330 compatibility

uniform bool uModelCoordinates;

out vec4  vColor;
out float vX, vY;
out float vLightIntensity; 

void
main( )
{
	vec3 tnorm = normalize( uNormalMatrix * aNormal );
	vec3 LightPos = vec3( 0., 0., 10. );
	vec3 ECposition = vec3( uModelViewMatrix * aVertex );
	vLightIntensity  = abs( dot( normalize(LightPos - ECposition), tnorm ) );

	vColor = aColor;
	vec3 MCposition = aVertex.xyz;
	if( uModelCoordinates )
	{
		vX = MCposition.x;
		vY = MCposition.y;
	}
	else
	{
		vX = ECposition.x;
		vY = ECposition.y;
	}
	gl_Position = uModelViewProjectionMatrix * aVertex;
}
