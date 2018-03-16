#version 330 compatibility

uniform float	uXcntr;
uniform float	uYcntr;
uniform float	uScale;
uniform bool	uPolar;
uniform float	uK;
uniform float	uTransX;
uniform float	uTransY;

out vec4	vColor;

void
main( )
{
	vColor = aColor;

	vec4 vertex = aVertex;
	vertex.xy -= vec2( uXcntr, uYcntr );
	vertex.xy /= uScale;

	vec2 pos = ( uModelViewMatrix * vertex ).xy;
	pos += vec2( uTransX, uTransY );
	float r = length( pos );

	vec4 pos2 = vec4( 0., 0., -5., 1. );
	if( uPolar )
	{
		pos2.xy = pos / ( r + uK );
	}
	else
	{
		pos2.xy = pos * inversesqrt( pos*pos + uK*uK );
	}

	gl_Position = uProjectionMatrix * pos2;
}
