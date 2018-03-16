#version 330 compatibility

uniform sampler2D uImageUnit;
uniform float uTX, uTY, uAX, uAY;
uniform int uRes;

in vec2 vST;

layout(location=0) out vec4 fFragColor;

const float PI = 3.14159265;

void main( )
{
	float x = float(uRes) * vST.x;
	float y = float(uRes) * vST.y;  // extract pixel coordinates from texture coordinates
	//float y = vST.y;  // extract pixel coordinates from texture coordinates
	//float x = vST.x;

	float x1 = uAX * sin(2.*PI*y/uTX);
	float y1 = uAY * sin(2.*PI*x/uTY);
	x += x1; y += y1;
	vec2 newst = vec2( x, y ) / float( uRes );

	vec3 irgb = texture2D( uImageUnit,  newst ).rgb;
	fFragColor = vec4( irgb, 1. );
}
