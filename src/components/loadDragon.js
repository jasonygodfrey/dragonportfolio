import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

export function loadDragon(scene, mixers, animationTriggered) {
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

    const handleScroll = () => {
      const scrollPercentage = (window.scrollY / document.body.scrollHeight) * 100;
      console.log(`Scroll Percentage: ${scrollPercentage}%`);  // Log the scroll percentage
    
      if (scrollPercentage >= 10 && !animationTriggered.current) {
        console.log("Triggering animation [2]");
        animationTriggered.current = true;
        if (gltf.animations.length > 1) {
          currentAction.stop();  // Stop the current action immediately
          const secondAction = dragonMixer.clipAction(gltf.animations[2]);
          secondAction.reset();
          secondAction.play();
          secondAction.clampWhenFinished = true;
          
          // Add listener for when animation finishes
          secondAction.addEventListener('finished', () => {
            secondAction.stop();
            currentAction = dragonMixer.clipAction(gltf.animations[0]);
            currentAction.reset();
            currentAction.play();
            animationTriggered.current = false;  // Reset trigger state
          });
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, undefined, (error) => {
    console.error('An error happened loading the GLTF model:', error);
  });
}
