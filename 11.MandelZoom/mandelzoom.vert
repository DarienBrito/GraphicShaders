#version 400 compatibility
#extension GL_NV_gpu_shader5 : enable

uniform float	uZoom;

out vec2	vST;

void main( )
{
	vST = 2. * ( aTexCoord0.st - vec2(0.5,0.5) );	// [-1.,+1.]

	float factor = pow( 10., uZoom);
	vec4 vert = vec4( factor*aVertex.xy, aVertex.zw );
	gl_Position = uModelViewProjectionMatrix * vert;
}
