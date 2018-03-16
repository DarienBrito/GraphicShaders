#version 400 compatibility

out vec3  vCenter;
out float vRadius;

void main( )
{
	vCenter = aVertex.xyz;
	vRadius = aVertex.w;

	gl_Position = vec4( 0., 0., 0., 1. );
}
