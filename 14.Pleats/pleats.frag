#version 330 compatibility

uniform float 		uKa, uKd, uKs;
uniform vec4  		uColor;
uniform vec4  		uSpecularColor;
uniform float 		uShininess;
uniform bool  		uPerFragment;
uniform bool  		uFlat;
uniform sampler3D	Noise3;
uniform float		uNoiseAmp;
uniform float		uNoiseFreq;

flat in vec3 vNf;
     in vec3 vNs;
flat in vec3 vLf;
     in vec3 vLs;
flat in vec3 vEf;
     in vec3 vEs;

flat in vec3 vPVf;
     in vec3 vPVs;

in      vec3 vMC;

layout(location=0) out vec4 fFragColor;


vec3
RotateNormal( float angx, float angy, vec3 n )
{
	float cx = cos( angx );
	float sx = sin( angx );
	float cy = cos( angy );
	float sy = sin( angy );
	
	// rotate about x:
	float yp =  n.y*cx - n.z*sx;	// y'
	n.z      =  n.y*sx + n.z*cx;	// z'
	n.y      =  yp;
	// n.x      =  n.x;

	// rotate about y:
	float xp =  n.x*cy + n.z*sy;	// x'
	n.z      = -n.x*sy + n.z*cy;	// z'
	n.x      =  xp;
	// n.y      =  n.y;

	return normalize( n );
}


void
main( )
{
	vec3 Normal;
	vec3 Light;
	vec3 Eye;

	if( uFlat )
	{
		Normal = normalize(vNf);
		Light =  normalize(vLf);
		Eye =    normalize(vEf);
	}
	else
	{
		Normal = normalize(vNs);
		Light =  normalize(vLs);
		Eye =    normalize(vEs);
	}

	vec4 nvx = texture3D( Noise3, uNoiseFreq*vMC );
	vec4 nvy = texture3D( Noise3, uNoiseFreq*vec3(vMC.xy,vMC.z+0.5) );

	float angx = nvx.r + nvx.g + nvx.b + nvx.a;	//  1. -> 3.
	angx = angx - 2.;					// -1. -> 1.
	angx *= uNoiseAmp;

	float angy = nvy.r + nvy.g + nvy.b + nvy.a;	//  1. -> 3.
	angy = angy - 2.;					// -1. -> 1.
	angy *= uNoiseAmp;

	Normal = RotateNormal( angx, angy, Normal );
	Normal = normalize( uNormalMatrix * Normal );


	vec4 ambient = uKa * uColor;

	float d = max( dot(Normal,Light), 0. );
	vec4 diffuse = uKd * d * uColor;

	float s = 0.;
	if( dot(Normal,Light) > 0. )		// only do specular if the light can see the point
	{
		vec3 ref = normalize( 2. * Normal * dot(Normal,Light) - Light );
		s = pow( max( dot(Eye,ref),0. ), uShininess );
	}
	vec4 specular = uKs * s * uSpecularColor;

	if( uPerFragment )
	{
		fFragColor = vec4( ambient.rgb + diffuse.rgb + specular.rgb, 1. );
	}
	else
	{
		if( uFlat )
			fFragColor = vec4( vPVf, 1. );
		else
			fFragColor = vec4( vPVs, 1. );
	}
}
