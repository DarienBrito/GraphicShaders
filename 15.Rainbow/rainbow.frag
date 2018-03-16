#version 330 compatibility

in vec3  vMCposition;
in float vLightIntensity; 
in vec2  vST;

layout(location=0) out vec4 fFragColor;

uniform float uNoiseMag;
uniform float uNoiseFreq;
uniform float uA;
uniform float uTol;
uniform bool  uUseTextureCoords;
uniform sampler3D Noise3;


const vec4 RED		= vec4( 1., 0., 0., 1. );
const vec4 ORANGE	= vec4( 1., .5, 0., 1. );
const vec4 YELLOW	= vec4( 1., 1., 0., 1. );
const vec4 GREEN	= vec4( 0., 1., 0., 1. );
const vec4 CYAN		= vec4( 0., 1., 1., 1. );
const vec4 BLUE		= vec4( 0., 0., 1., 1. );
const vec4 MAGENTA	= vec4( 1., 0., 1., 1. );
const vec4 WHITE	= vec4( 1., 1., 1., 1. );

const float ONE16      = 1./16.;
const float THREE16    = 3./16.;
const float FIVE16     = 5./16.;
const float SEVEN16    = 7./16.;
const float NINE16     = 9./16.;
const float ELEVEN16   = 11./16.;
const float THIRTEEN16 = 13./16.;
const float FIFTEEN16  = 15./16.;

// return 0. if < left-tol or > right+tol
// return 1. if >= left+tol and <= right-tol
// else blend

float
Pulse( float value, float left, float right, float tol )
{
	float t = (  smoothstep( left-tol, left+tol, value )  -  smoothstep( right-tol, right+tol, value )  );
	return t;
}


void
main( void )
{
	vec4  nv  = texture3D( Noise3, uNoiseFreq*vMCposition );
	float n = nv[0] + nv[1] + nv[2] + nv[3];	// 1. -> 3.
	n = ( n - 2. );				// -1. -> 1.
	float deltax = uNoiseMag * n;

	float X;
	if( uUseTextureCoords )
		X = vST.s;
	else
		X = vMCposition.x;

	float f = fract( uA * (X+deltax) );
	float t = smoothstep( ONE16 - uTol, ONE16 + uTol, f );
	fFragColor = mix( WHITE, RED, t );
	if( f >= THREE16 - uTol )
	{
		t = smoothstep( THREE16 - uTol, THREE16 + uTol, f );
		fFragColor = mix( RED, ORANGE, t );
	}
	if( f >= FIVE16 - uTol )
	{
		t = smoothstep( FIVE16 - uTol, FIVE16 + uTol, f );
		fFragColor = mix( ORANGE, YELLOW, t );
	}
	if( f >= SEVEN16 - uTol )
	{
		t = smoothstep( SEVEN16 - uTol, SEVEN16 + uTol, f );
		fFragColor = mix( YELLOW, GREEN, t );
	}
	if( f >= NINE16 - uTol )
	{
		t = smoothstep( NINE16 - uTol, NINE16 + uTol, f );
		fFragColor = mix( GREEN, CYAN, t );
	}
	if( f >= ELEVEN16 - uTol )
	{
		t = smoothstep( ELEVEN16 - uTol, ELEVEN16 + uTol, f );
		fFragColor = mix( CYAN, BLUE, t );
	}
	if( f >= THIRTEEN16 - uTol )
	{
		t = smoothstep( THIRTEEN16 - uTol, THIRTEEN16 + uTol, f );
		fFragColor = mix( BLUE, MAGENTA, t );
	}

	if( f >= FIFTEEN16 - uTol )
	{
		t = smoothstep( FIFTEEN16 - uTol, FIFTEEN16 + uTol, f );
		fFragColor = mix( MAGENTA, WHITE, t );
	}
	
	fFragColor.rgb *= vLightIntensity;
}
