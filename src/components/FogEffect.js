import * as THREE from 'three';

class FogEffect {
  constructor(scene, color = 0x000000, near = 1, far = 1000) {
    this.scene = scene;
    this.color = color;
    this.near = near;
    this.far = far;
    this.initFog();
  }

  initFog() {
    this.scene.fog = new THREE.Fog(this.color, this.near, this.far);
  }
}

export default FogEffect;
