#version 330 compatibility

// Fragment shader to create three different transitions between two
// images; your choice is determined by the value of  choice.
// For choice == 1, the Before image is replaced by the After image
// based on the average of the RGB values of the After image
// For choice == 2, the Before image is replaced by the After image
// by moving a partition point across the space and having the After
// image squeeze out the Before image.
// For choice == 3, the Before image is replaced by the After image
// based on the value of a noise texture that is independent of both
// the Before and After images.

uniform float uT;
uniform sampler2D uBeforeUnit, uAfterUnit;
uniform sampler3D Noise3;

in vec3 vMCposition;
in vec2 vST;

layout(location=0) out vec4 fFragColor;

void main( )
{
	int choice = 2;

	vec2 st = vST;
	vec3 brgb = texture2D( uBeforeUnit, st ).rgb;
	vec3 argb = texture2D( uAfterUnit,  st ).rgb;
	vec3 color;

	if ( choice == 1 )
	{
		if ( (argb.x + argb.y + argb.z)/3. > uT )
			color = brgb;
		else
			color = argb;
	}

	if ( choice == 2 )
	{
		if ( st.x < uT )
		{
			st = vec2( st.x/uT, st.y );
			vec3 thisrgb = texture2D( uAfterUnit, st ).rgb;
			color = thisrgb;
		}
		else
		{
			st = vec2( (st.x-uT)/(1-uT), st.y );
			vec3 thatrgb = texture2D( uBeforeUnit, st ).rgb;
			color = thatrgb;
		}
	}

	if ( choice == 3 )
	{
		vec4 nv = texture3D(Noise3, vMCposition/10.);
		float sum = nv[0] + nv[1] + nv[2] + nv[3];		// 1 -> 3
		sum = fract( sum );
		if ( sum < uT )
			color = argb;
		else
			color = brgb;
	
		//	un-comment line below to see the texture that controls the transition
		// color = vec3(sum);
	}

	fFragColor = vec4( color, 1.);
}
