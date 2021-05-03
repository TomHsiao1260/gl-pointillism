precision mediump float;
 
uniform sampler2D u_image0;
uniform sampler2D u_image1;

varying vec2 v_texCoord;
varying vec2 v_posCoord;
 
void main() {
  gl_FragColor  = texture2D(u_image0, v_texCoord);
  gl_FragColor *= texture2D(u_image1, v_posCoord);
}