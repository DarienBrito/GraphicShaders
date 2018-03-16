#version 330 compatibility

uniform sampler2D uImageUnit, uBeforeUnit, uAfterUnit;
uniform float uAng;
uniform float uT;
uniform float uResS, uResT;

in vec2 vST;

layout(location=0) out vec4 fFragColor;

const float PI = 3.14159265;
const float PI_OVER_4 = PI/4.;
const float SIN_PI_OVER_4 = 0.707;


void main( )
{
	vec3 irgb = texture2D( uImageUnit,  vST ).rgb;
	vec3 brgb = texture2D( uBeforeUnit, vST ).rgb;
	vec3 argb = texture2D( uAfterUnit,  vST ).rgb;
	vec4 color = vec4( 1., 0., 0., 1. );

#define NEGATIVE

#ifdef NEGATIVE
	color.rgb = vec3(1.,1.,1.) - irgb;
#endif

#ifdef BRIGHTNESS
	vec3 target = vec3( 0., 0., 0. );
	color = vec4( mix( target, irgb, uT ), 1. );
#endif

#ifdef CONTRAST
	vec3 target = vec3( 0.5, 0.5, 0.5 );
	color = vec4( mix( target, irgb, uT ), 1. );
#endif

#ifdef SATURATION
	float lum = dot( irgb, vec3(0.2125,0.7154,0.0721) );
	vec3 target = vec3( lum, lum, lum );
	color = vec4( mix( target, irgb, uT ), 1. );
#endif

#ifdef DIFFERENCE
	vec3 target = abs( argb - brgb );
	if( uT <= 1. )
		color = vec4( mix( argb, brgb, uT ), 1. );
	else
		color = vec4( mix( brgb, target, uT-1. ), 1. );
#endif

#ifdef DISSOLVE
	color = vec4( mix( argb, brgb, uT ), 1. );
#endif

#ifdef SHARPNESS
	vec2 stp0 = vec2(1./uResS,  0. );
	vec2 st0p = vec2(0.     ,  1./uResT);
	vec2 stpp = vec2(1./uResS,  1./uResT);
	vec2 stpm = vec2(1./uResS, -1./uResT);
	vec3 i00 =   texture2D( uImageUnit, vST ).rgb;
	vec3 im1m1 = texture2D( uImageUnit, vST-stpp ).rgb;
	vec3 ip1p1 = texture2D( uImageUnit, vST+stpp ).rgb;
	vec3 im1p1 = texture2D( uImageUnit, vST-stpm ).rgb;
	vec3 ip1m1 = texture2D( uImageUnit, vST+stpm ).rgb;
	vec3 im10 =  texture2D( uImageUnit, vST-stp0 ).rgb;
	vec3 ip10 =  texture2D( uImageUnit, vST+stp0 ).rgb;
	vec3 i0m1 =  texture2D( uImageUnit, vST-st0p ).rgb;
	vec3 i0p1 =  texture2D( uImageUnit, vST+st0p ).rgb;
	vec3 target = vec3(0.,0.,0.);
	target += 1.*(im1m1+ip1m1+ip1p1+im1p1);
	target += 2.*(im10+ip10+i0m1+i0p1);
	target += 4.*(i00);
	target /= 16.;
	color = vec4( mix( target, irgb, uT ), 1. );
#endif

#ifdef EDGE
	vec2 stp0 = vec2(1./uResS,  0. );
	vec2 st0p = vec2(0.     ,  1./uResT);
	vec2 stpp = vec2(1./uResS,  1./uResT);
	vec2 stpm = vec2(1./uResS, -1./uResT);
	float i00 =   dot( texture2D( uImageUnit, vST ).rgb, vec3(0.2125,0.7154,0.0721) );
	float im1m1 = dot( texture2D( uImageUnit, vST-stpp ).rgb, vec3(0.2125,0.7154,0.0721) );
	float ip1p1 = dot( texture2D( uImageUnit, vST+stpp ).rgb, vec3(0.2125,0.7154,0.0721) );
	float im1p1 = dot( texture2D( uImageUnit, vST-stpm ).rgb, vec3(0.2125,0.7154,0.0721) );
	float ip1m1 = dot( texture2D( uImageUnit, vST+stpm ).rgb, vec3(0.2125,0.7154,0.0721) );
	float im10 =  dot( texture2D( uImageUnit, vST-stp0 ).rgb, vec3(0.2125,0.7154,0.0721) );
	float ip10 =  dot( texture2D( uImageUnit, vST+stp0 ).rgb, vec3(0.2125,0.7154,0.0721) );
	float i0m1 =  dot( texture2D( uImageUnit, vST-st0p ).rgb, vec3(0.2125,0.7154,0.0721) );
	float i0p1 =  dot( texture2D( uImageUnit, vST+st0p ).rgb, vec3(0.2125,0.7154,0.0721) );
	float h = -1.*im1p1 - 2.*i0p1 - 1.*ip1p1  +  1.*im1m1 + 2.*i0m1 + 1.*ip1m1;
	float v = -1.*im1m1 - 2.*im10 - 1.*im1p1  +  1.*ip1m1 + 2.*ip10 + 1.*ip1p1;
	

	float mag = sqrt( h*h + v*v );
	//vec3 target = vec3( mag,mag,mag );
	vec3 target = vec3( mag,mag,0. );
	color = vec4( mix( irgb, target, uT ), 1. );
#endif

#ifdef CHROMAKEY
	float r = irgb.r;
	float g = irgb.g;
	float b = irgb.b;
	color = vec4( irgb, 1. );
	float rlimit = uT;
	float glimit = uT;
	float blimit = 1. - uT;
	if( r <= rlimit  &&  g <= glimit  &&  b >= blimit )
		color = vec4( brgb, 1. );
#endif


#ifdef EMBOSS
	vec2 stp0 = vec2( 1./uResS,  0. );
	vec2 st0p = vec2( 0.     ,  1./uResT );
	vec2 stpp = vec2( 1./uResS,  1./uResT );
	vec2 stpm = vec2( 1./uResS, -1./uResT );

	vec3 c00   = texture2D( uImageUnit, vST ).rgb;
	vec3 cm1m1 = texture2D( uImageUnit, vST-stpp ).rgb;
	vec3 cp1p1 = texture2D( uImageUnit, vST+stpp ).rgb;
	vec3 cm1p1 = texture2D( uImageUnit, vST-stpm ).rgb;
	vec3 cp1m1 = texture2D( uImageUnit, vST+stpm ).rgb;
	vec3 cm10  = texture2D( uImageUnit, vST-stp0 ).rgb;
	vec3 cp10  = texture2D( uImageUnit, vST+stp0 ).rgb;
	vec3 c0m1  = texture2D( uImageUnit, vST-st0p ).rgb;
	vec3 c0p1  = texture2D( uImageUnit, vST+st0p ).rgb;

	float uAngr = uAng * (PI/180.);

	vec3 diffs;

	if( 0.*PI_OVER_4 <= uAngr  &&  uAngr <= 1.*PI_OVER_4 )
	{
		float t = ( uAngr - 0.*PI_OVER_4 ) / PI_OVER_4;
		diffs = (  (c00-cp10)*sin( (1.-t)*PI_OVER_4 ) + (c00-cp1p1)*sin( t*PI_OVER_4 )  ) / SIN_PI_OVER_4;
	}
	else if( 1.*PI_OVER_4 < uAngr  &&  uAngr <= 2.*PI_OVER_4 )
	{
		float t = ( uAngr - 1.*PI_OVER_4 ) / PI_OVER_4;
		diffs = (  (c00-cp1p1)*sin( (1.-t)*PI_OVER_4 ) + (c00-c0p1)*sin( t*PI_OVER_4 )  ) / SIN_PI_OVER_4;
	}
	else if( 2.*PI_OVER_4 < uAngr  &&  uAngr <= 3.*PI_OVER_4 )
	{
		float t = ( uAngr - 2.*PI_OVER_4 ) / PI_OVER_4;
		diffs = (  (c00-c0p1)*sin( (1.-t)*PI_OVER_4 ) + (c00-cm1p1)*sin( t*PI_OVER_4 )  ) / SIN_PI_OVER_4;
	}
	else if( 3.*PI_OVER_4 < uAngr  &&  uAngr <= 4.*PI_OVER_4 )
	{
		float t = ( uAngr - 3.*PI_OVER_4 ) / PI_OVER_4;
		diffs = (  (c00-cm1p1)*sin( (1.-t)*PI_OVER_4 ) + (c00-cm10)*sin( t*PI_OVER_4 )  ) / SIN_PI_OVER_4;
	}
	else if( 4.*PI_OVER_4 < uAngr  &&  uAngr <= 5.*PI_OVER_4 )
	{
		float t = ( uAngr - 4.*PI_OVER_4 ) / PI_OVER_4;
		diffs = (  (c00-cm10)*sin( (1.-t)*PI_OVER_4 ) + (c00-cm1m1)*sin( t*PI_OVER_4 )  ) / SIN_PI_OVER_4;
	}
	else if( 5.*PI_OVER_4 < uAngr  &&  uAngr <= 6.*PI_OVER_4 )
	{
		float t = ( uAngr - 5.*PI_OVER_4 ) / PI_OVER_4;
		diffs = (  (c00-cm1m1)*sin( (1.-t)*PI_OVER_4 ) + (c00-c0m1)*sin( t*PI_OVER_4 )  ) / SIN_PI_OVER_4;
	}
	else if( 6.*PI_OVER_4 < uAngr  &&  uAngr <= 7.*PI_OVER_4 )
	{
		float t = ( uAngr - 6.*PI_OVER_4 ) / PI_OVER_4;
		diffs = (  (c00-c0m1)*sin( (1.-t)*PI_OVER_4 ) + (c00-cp1m1)*sin( t*PI_OVER_4 )  ) / SIN_PI_OVER_4;
	}
	else if( 7.*PI_OVER_4 < uAngr )
	{
		float t = ( uAngr - 7.*PI_OVER_4 ) / PI_OVER_4;
		diffs = (  (c00-cp1m1)*sin( (1.-t)*PI_OVER_4 ) + (c00-cp10)*sin( t*PI_OVER_4 )  ) / SIN_PI_OVER_4;
	}

	float max = diffs.r;
	if( abs(diffs.g) > abs(max) )
		max = diffs.g;
	if( abs(diffs.b) > abs(max) )
		max = diffs.b;

	float gray = clamp( max + .5, 0., 1. );
	vec4 grayVersion  = vec4( gray, gray, gray, 1. );
	vec4 colorVersion = vec4( gray*c00, 1. );
	color = mix( grayVersion, colorVersion, uT );
#endif


	fFragColor = color;
}
