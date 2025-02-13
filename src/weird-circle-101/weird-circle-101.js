import * as THREE from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'
// import testTexture from '../static/texture.jpg';
import { lerp } from 'three/src/math/MathUtils.js';


export default class Sketch {
  constructor (options) {
    this.container = options.domElement;
    
    this.width=this.container.offsetWidth;
    this.height=this.container.offsetHeight;

    this.camera = new THREE.PerspectiveCamera( 70, this.width/this.height, 0.01, 10 );
    this.camera.position.z = 1;

    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer( { 
      antialias: true,
      alpha: true
    } );
    this.renderer.setPixelRatio(window.devicePixelRatio);
    // this.renderer.setPixelRatio(2);
    this.container.appendChild(this.renderer.domElement);
    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    
    
    this.time = 0;
    this.mouse = { x: 0, y: 0 }
    this.mouseTarget = { x: 0.5, y: 0.5 }
    this.damping = 0.01;
    this.onResize()
    this.addObjects()
    this.render();
    
    this.bindings()
  }

  onClick() {
    this.time = 0;
    this.mouse = { x: 0, y: 0 }
    this.mouseTarget = { x: 0.5, y: 0.5 }
  }

  onResize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize( this.width, this.height );
    this.camera.aspect = this.width/this.height;
    this.camera.updateProjectionMatrix();
  }

  onMouseMove(e) {
    this.mouseTarget.x = e.clientX / window.innerWidth
    this.mouseTarget.x = this.mouseTarget.x > 0.5 ? (this.mouseTarget.x - 0.5) : (-0.5 + this.mouseTarget.x)
    
    this.mouseTarget.y = e.clientY / window.innerWidth
    this.mouseTarget.y = this.mouseTarget.y > 0.5 ? (this.mouseTarget.y - 0.5) : (-0.5 + this.mouseTarget.y)
  }

  bindings(){
    window.addEventListener('click',this.onClick.bind(this));
    window.addEventListener('resize',this.onResize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
  }

  addObjects(){
    // this.geometry = new THREE.PlaneGeometry( 0.5, 0.5,100,100);
    this.geometry = new THREE.SphereGeometry( 0.1,60, 60);
    this.material = new THREE.ShaderMaterial({
      // wireframe: true,
      uniforms: {
        time: { value: 1.0 },
        x: { value: 0.5 },
        y: { value: 0.5 },
        // uTexture: {value: new THREE.TextureLoader().load(testTexture)},
        resolution: { value: new THREE.Vector2() }
      },
      vertexShader: vertex,
      fragmentShader: fragment,
    })

    this.mesh = new THREE.Mesh( this.geometry, this.material );
    this.scene.add( this.mesh );
  }

  render(){
    this.time += 0.005;
    this.mouse.x = lerp(this.mouse.x, this.mouseTarget.x, this.damping)
    this.mouse.y = lerp(this.mouse.y, this.mouseTarget.y, this.damping)

    this.material.uniforms.time.value = this.time;
    // this.mesh.rotation.x = this.time / 1000;
    // this.mesh.rotation.y = this.time / 10;
    
    this.mesh.rotation.x = this.mouse.y * this.time;
    this.mesh.rotation.y = this.mouse.x * this.time;
    this.material.uniforms.x.value = this.mouse.x
    this.material.uniforms.y.value = this.mouse.y

    this.renderer.render( this.scene, this.camera);

    // console.log(this.time);
    requestAnimationFrame(this.render.bind(this))
  }
}

new Sketch({
  domElement: document.querySelector('[data-js="canvas"]')
});

