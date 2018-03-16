#version 330 compatibility
out float vLightIntensity;
out vec3  vMCposition;

uniform vec3  uLightPos;
uniform float uScale;

void main( )
{
    vec3 ECposition = vec3( uModelViewMatrix * aVertex );
    vMCposition     = uScale * vec3( aVertex );
    vec3 tnorm      = normalize( vec3( uNormalMatrix * aNormal ) );
    vLightIntensity  = abs( dot( normalize(uLightPos - ECposition), tnorm ) );

    gl_Position     = uModelViewProjectionMatrix * aVertex;
}
