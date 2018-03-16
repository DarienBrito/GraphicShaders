#version 330 compatibility

in float gLightIntensity;

layout(location=0) out vec4 fFragColor;

const vec3 COLOR = vec3( 0., 1., 0. );

void
main( )
{
	fFragColor = vec4( gLightIntensity*COLOR, 1.  );
}
