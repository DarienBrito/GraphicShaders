#version 330 compatibility

uniform bool  uUseDiscard;
uniform float uSize;

in float vLightIntensity; 
in vec4  vColor;
in vec2  vST;

layout( location=0 ) out vec4 fFragColor;

void
main( )
{
	float s = vST.s;
	float t = vST.t;
	float sp = 2. * s;
	float tp = t;
	float numins = floor( sp / uSize );
	float numint = floor( tp / uSize );

	fFragColor = vColor;		// default color

	if( mod( numins+numint, 2. ) == 0. )
	{
		if( uUseDiscard )
		{
			discard;
		}
		else
		{
			fFragColor = vec4( 1., 1., 1., 0. );		// alpha = 0.0
		}
	}

	fFragColor.rgb *= vLightIntensity;	// apply lighting model
}
