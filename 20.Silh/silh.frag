#version 330 compatibility

uniform vec4	uColor;
uniform bool	uSilh;

in float	gLightIntensity;

layout(location=0) out vec4 fFragColor;

void
main( )
{
	if( ! uSilh )
		discard;

	fFragColor = vec4( uColor.rgb, 1. );
}
