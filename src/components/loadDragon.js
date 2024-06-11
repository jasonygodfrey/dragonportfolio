import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

export function loadDragon(scene, mixers, animationTriggered, animationsRef) {
  const loader = new GLTFLoader();

  loader.load('blue_dragon/scene.gltf', (gltf) => {
    const dragon = gltf.scene;
    dragon.scale.set(10000, 10000, 10000);
    dragon.position.set(0, -250, -300);
    scene.add(dragon);
    
    const dragonMixer = new THREE.AnimationMixer(dragon);
    mixers.current.push(dragonMixer);

    let currentAction = dragonMixer.clipAction(gltf.animations[0]);
    currentAction.play();

    // Store animations in animationsRef
    animationsRef.current = gltf.animations;

    const handleMouseClick = () => {
      if (!animationTriggered.current && gltf.animations.length > 2) {
        animationTriggered.current = true;
        currentAction.stop();  // Stop the current action immediately
        const fourthAction = dragonMixer.clipAction(gltf.animations[2]); // Assuming the desired animation is at index 3
        fourthAction.reset();
        fourthAction.play();
        fourthAction.clampWhenFinished = true;
        
        // Add listener for when animation finishes
        dragonMixer.addEventListener('finished', (e) => {
          if (e.action === fourthAction) {
            fourthAction.stop();
            currentAction.reset();
            currentAction.play();
            animationTriggered.current = false;  // Reset trigger state
          }
        });
      }
    };

    window.addEventListener('click', handleMouseClick);

    return () => {
      window.removeEventListener('click', handleMouseClick);
    };
  }, undefined, (error) => {
    console.error('An error happened loading the GLTF model:', error);
  });
}
