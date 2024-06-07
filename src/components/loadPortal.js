import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

export function loadPortal(scene, mixers) {
  const loader = new GLTFLoader();

  loader.load('/portal/scene.gltf', (gltf) => {
    const portal = gltf.scene;
    portal.scale.set(0.1, 0.1, 0.1);
    portal.position.set(0, -80, -300);
    portal.rotation.y = Math.PI / 2.2;
    scene.add(portal);

    const portalMixer = new THREE.AnimationMixer(portal);
    mixers.current.push(portalMixer);
    gltf.animations.forEach((clip) => {
      const action = portalMixer.clipAction(clip);
      action.play();
    });
  }, undefined, (error) => {
    console.error('An error happened loading the GLTF model:', error);
  });
}
