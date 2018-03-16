#version 330 compatibility

uniform float uKa, uKd, uKs;
uniform vec4  uColor;
uniform vec4  uSpecularColor;
uniform float uShininess;
uniform bool  uPerVertex;
uniform bool  uFlat;
uniform bool  uHalfAngle;

flat in vec3 vNf;
     in vec3 vNs;
flat in vec3 vLf;
     in vec3 vLs;
flat in vec3 vEf;
     in vec3 vEs;

flat in vec3 vPVf;
     in vec3 vPVs;

layout(location=0) out vec4 fFragColor;


void
main( )
{
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

	if( uPerVertex )
	{
		if( uFlat )
			fFragColor = vec4( vPVf, 1. );
		else
			fFragColor = vec4( vPVs, 1. );
	}
	else
	{
		fFragColor = vec4( ambient.rgb + diffuse.rgb + specular.rgb, 1. );
	}
}
