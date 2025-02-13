uniform float time;
uniform float x;
uniform float y;
// uniform sampler2D uTexture;

varying float pulse;
varying vec2 vUv;
varying vec3 vNormal;

void main() {
    // gl_FragColor = vec4(0.,0.,1., 1.);

    // vec4 myimage = texture(
    //   uTexture,
    //   vUv + 0.01*sin(vUv*20. + time) 
    // );

    float sinePulse = (y + sin(vUv.x*1.));
    // gl_FragColor = vec4( vUv,0.,1.);
    // gl_FragColor = vec4( sinePulse,0.,0.,1.);
    // gl_FragColor = myimage;
    // gl_FragColor = vec4( pulse,time*0.05,time*0.25,1.);

    float r = smoothstep(0.1, 0.01, time * pulse * x);
    float g = smoothstep(0.1, 0.01, time * pulse * y);
    // float centerMaxMin = max(0.0, center);
    // get a value between 0 and 1

    gl_FragColor = vec4(
      r,
      g,
      sinePulse*5.5,
      0.1
    );
}