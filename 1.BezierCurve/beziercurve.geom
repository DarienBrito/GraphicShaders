#version 330 compatibility
#extension GL_EXT_gpu_shader4: enable
#extension GL_EXT_geometry_shader4: enable

layout( lines_adjacency )  in;
layout( line_strip, max_vertices=200 )  out;

uniform int uNum;

void main( )
{
	float dt = 1. / float(uNum);
	float t = 0.;
	for( int i = 0; i <= uNum; i++ )
	{
		float omt = 1. - t;
		float omt2 = omt * omt;
		float omt3 = omt * omt2;
		float t2 = t * t;
		float t3 = t * t2;

		vec4 xyzw =	         omt3 * gl_PositionIn[0].xyzw  +
				3. * t * omt2 * gl_PositionIn[1].xyzw  +
				3. * t2 * omt * gl_PositionIn[2].xyzw  +
				           t3 * gl_PositionIn[3].xyzw;

		gl_Position = xyzw;
		EmitVertex( );
		t += dt;
	}
}
