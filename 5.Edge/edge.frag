#version 330 compatibility

in vec2 vST;

layout(location=0) out vec4 fFragColor;

uniform float uT;
uniform float uResS, uResT;
uniform sampler2D uImageUnit;

void main( )
{
	vec3 irgb = texture2D( uImageUnit,  vST ).rgb;
	vec4 color = vec4( 1., 0., 0., 1. );

	vec2 stp0 = vec2(1./uResS,  0. );
	vec2 st0p = vec2(0.      ,  1./uResT);
	vec2 stpp = vec2(1./uResS,  1./uResT);
	vec2 stpm = vec2(1./uResS, -1./uResT);
	float i00 =   dot( texture2D( uImageUnit, vST ).rgb, vec3(0.2125,0.7154,0.0721) );
	float im1m1 = dot( texture2D( uImageUnit, vST -stpp ).rgb, vec3(0.2125,0.7154,0.0721) );
	float ip1p1 = dot( texture2D( uImageUnit, vST +stpp ).rgb, vec3(0.2125,0.7154,0.0721) );
	float im1p1 = dot( texture2D( uImageUnit, vST -stpm ).rgb, vec3(0.2125,0.7154,0.0721) );
	float ip1m1 = dot( texture2D( uImageUnit, vST +stpm ).rgb, vec3(0.2125,0.7154,0.0721) );
	float im10 =  dot( texture2D( uImageUnit, vST -stp0 ).rgb, vec3(0.2125,0.7154,0.0721) );
	float ip10 =  dot( texture2D( uImageUnit, vST +stp0 ).rgb, vec3(0.2125,0.7154,0.0721) );
	float i0m1 =  dot( texture2D( uImageUnit, vST -st0p ).rgb, vec3(0.2125,0.7154,0.0721) );
	float i0p1 =  dot( texture2D( uImageUnit, vST +st0p ).rgb, vec3(0.2125,0.7154,0.0721) );
	float h = -1.*im1p1 - 2.*i0p1 - 1.*ip1p1  +  1.*im1m1 + 2.*i0m1 + 1.*ip1m1;
	float v = -1.*im1m1 - 2.*im10 - 1.*im1p1  +  1.*ip1m1 + 2.*ip10 + 1.*ip1p1;
	

	float mag = sqrt( h*h + v*v );
	vec3 target = vec3( mag,mag,mag );
	color = vec4( mix( irgb, target, uT ), 1. );

	fFragColor = color;
}
