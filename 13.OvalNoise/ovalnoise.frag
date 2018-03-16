#version 330 compatibility

uniform float uAd;
uniform float uBd;
uniform float uNoiseAmp;
uniform float uNoiseFreq;
uniform float uAlpha;
uniform float uTol;
uniform bool uUseChromaDepth;
uniform float uChromaBlue;
uniform float uChromaRed;
uniform sampler3D Noise3;

in vec3  vMCposition;
in float vLightIntensity; 
in float vZ;
in vec2  vST;

layout(location=0) out vec4 fFragColor;


const vec3 ORANGE = vec3( 1., .5, 0. );
const vec3 WHITE  = vec3( 1., 1., 1.);

// return 0. if < left-tol or > right+tol
// return 1. if >= left+tol and <= right-tol
// else blend

float
Pulse( float value, float left, float right, float tol )
{
	float t = (  smoothstep( left-tol, left+tol, value )  -  smoothstep( right-tol, right+tol, value )  );
	return t;
}

vec3
ChromaDepth( float t )
{
	t = clamp( t, 0., 1. );

	float r = 1.;
	float g = 0.0;
	float b = 1.  -  6. * ( t - (5./6.) );

        if( t <= (5./6.) )
        {
                r = 6. * ( t - (4./6.) );
                g = 0.;
                b = 1.;
        }

        if( t <= (4./6.) )
        {
                r = 0.;
                g = 1.  -  6. * ( t - (3./6.) );
                b = 1.;
        }

        if( t <= (3./6.) )
        {
                r = 0.;
                g = 1.;
                b = 6. * ( t - (2./6.) );
        }

        if( t <= (2./6.) )
        {
                r = 1.  -  6. * ( t - (1./6.) );
                g = 1.;
                b = 0.;
        }

        if( t <= (1./6.) )
        {
                r = 1.;
                g = 6. * t;
        }

	return vec3( r, g, b );
}


void
main( )
{
	vec4  nv  = texture3D( Noise3, uNoiseFreq*vMCposition );
	float n = nv[0] + nv[1] + nv[2] + nv[3];	// 1. -> 3.
	n = ( n - 2. );				// -1. -> 1.

	vec2 st = vST;
	st.s *= 2.;

	float Ar = uAd/2.;
	float Br = uBd/2.;

	int numinu = int( st.s / uAd );
	int numinv = int( st.t / uBd );

	vec3 TheColor = WHITE;
	float alfa = 1.;

	st.s -= float(numinu) * uAd;
	st.t -= float(numinv) * uBd;
	vec3 upvp =  vec3( st, 0. );
	vec3 cntr =  vec3( Ar, Br, 0. );
	vec3 delta = upvp - cntr;
	float oldrad = length( delta );
	float newrad = oldrad + uNoiseAmp*n;
	delta = delta * newrad / oldrad;
	float du = delta.x/Ar;
	float dv = delta.y/Br;
	float d = du*du + dv*dv;
	if( abs( d - 1. ) <= uTol )
	{
		float t = smoothstep( 1.-uTol, 1.+uTol, d );
		TheColor = mix( ORANGE, WHITE, t );
	}
	if( d <= 1.-uTol )
	{
		TheColor = ORANGE;
	}
	if( d >= 1.+uTol )
	{
		alfa = uAlpha;
		if( alfa == 0. )
			discard;
	}

	if( uUseChromaDepth )
	{
		float t = (2./3.) * ( vZ - uChromaRed ) / ( uChromaBlue - uChromaRed );
		t = clamp( t, 0., 2./3. );
		TheColor = ChromaDepth( t );
	}


	fFragColor = vec4( vLightIntensity*TheColor, alfa );
}
