#version 330 compatibility

uniform sampler2D	uVisibleUnit;
uniform sampler2D	uInfraRedUnit;
uniform sampler2D	uWaterVaporUnit;
uniform float		uVisible;
uniform float		uInfraRed;
uniform float		uWaterVapor;
uniform float		uVisibleThreshold;
uniform float		uInfraRedThreshold;
uniform float		uWaterVaporThreshold;
uniform float		uBrightness;

in vec2 vST;

layout( location=0 ) out vec4 fFragColor;


void
main( )
{
	vec3 visibleColor    = texture2D( uVisibleUnit,  vST ).rgb;
	vec3 infraredColor   = texture2D( uInfraRedUnit, vST ).rgb;
	infraredColor = vec3(1.,1.,1.) - infraredColor;
	vec3 watervaporColor = texture2D( uWaterVaporUnit, vST ).rgb;

	vec3 rgb;

	if( visibleColor.r - visibleColor.g  > .25   &&   visibleColor.r - visibleColor.b > .25 )
	{
		rgb = vec3( 1., 1., 0. );	// state outlines become yellow
	}
	else
	{
		rgb = uVisible*visibleColor  +  uInfraRed*infraredColor  +  uWaterVapor*watervaporColor;
		rgb /= 3.;
		vec3 coefs = vec3( 0.296, 0.240, 0.464 );
		float visibleInten = dot(coefs,visibleColor);
		float infraredInten = dot(coefs,infraredColor);
		float watervaporInten = dot(coefs,watervaporColor);
		if( visibleInten > uVisibleThreshold  &&  infraredInten < uInfraRedThreshold  &&  watervaporInten > uWaterVaporThreshold )
		{
			rgb = vec3( 0., 1., 0. );
		}
		else
		{
			rgb *= uBrightness;
			rgb = clamp( rgb, 0., 1. );
		}
	}

	fFragColor = vec4( rgb, 1. );
}
