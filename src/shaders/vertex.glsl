attribute vec2 a_position;
attribute vec2 a_shift;
attribute vec2 a_texCoord;

uniform vec2 u_resolution;
varying vec2 v_texCoord;
varying vec2 v_posCoord;
 
void main() {
  vec2 pos = a_position + a_shift;
  vec2 normalized = pos / u_resolution;
  vec2 clipSpace = 2.0 * normalized - 1.0;

  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);

  v_texCoord = a_texCoord;
  v_posCoord = normalized;
}