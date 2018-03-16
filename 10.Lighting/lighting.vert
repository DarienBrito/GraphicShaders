#version 330 compatibility

uniform float uLightX, uLightY, uLightZ;
uniform float uKa, uKd, uKs;
uniform vec4  uColor;
uniform vec4  uSpecularColor;
uniform float uShininess;
uniform bool  uPerVertex;
uniform bool  uFlat;
uniform bool  uHalfAngle;

flat out vec3 vNf;
     out vec3 vNs;
flat out vec3 vLf;
     out vec3 vLs;
flat out vec3 vEf;
     out vec3 vEs;

flat out vec3 vPVf;
     out vec3 vPVs;


void
main( )
{ 

	vec4 ECposition = uModelViewMatrix * aVertex;

	vec3 eyeLightPosition = vec3( uLightX, uLightY, uLightZ );

	vNs = normalize( uNormalMatrix * aNormal );	// surface normal vector
	vNf = vNs;

	vLs = eyeLightPosition - ECposition.xyz;		// vector from the point
	vLf = vLs;
								// to the light position
	vEs = vec3( 0., 0., 0. ) - ECposition.xyz;		// vector from the point
	vEf = vEs;

	vec3 Normal;
	vec3 Light;
	vec3 Eye;
	if( uFlat )
	{
		Normal = normalize(vNf);
		Light = normalize(vLf);
		Eye = normalize(vEf);
	}
	else
	{
		Normal = normalize(vNs);
		Light = normalize(vLs);
		Eye = normalize(vEs);
	}

	vec4 ambient = uKa * uColor;

	float d = max( dot(Normal,Light), 0. );
	vec4 diffuse = uKd * d * uColor;

	float s = 0.;
	if( dot(Normal,Light) > 0. )		// only do specular if the light can see the point
	{
		if( uHalfAngle )				// use half-vector method
		{
			vec3 hlf = normalize(Eye+Light);
			s = pow( max( dot(hlf,Normal), 0. ), uShininess );
		}
		else					// use reflection-vector method
		{
			vec3 ref = normalize( 2. * Normal * dot(Normal,Light) - Light );
			s = pow( max( dot(Eye,ref),0. ), uShininess );
		}
	}
	vec4 specular = uKs * s * uSpecularColor;

	vPVs = ambient.rgb + diffuse.rgb + specular.rgb;
	vPVf = vPVs;

	gl_Position = uModelViewProjectionMatrix * aVertex;
}
