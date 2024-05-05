import React, { useEffect, useRef, forwardRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

const ThreeBackground = forwardRef((props, ref) => {
  const rendererRef = useRef(null);
  const mixers = useRef([]); // Array to hold all AnimationMixers
  const lastMousePosition = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const cameraRotation = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100000);
    const renderer = new THREE.WebGLRenderer({
      canvas: rendererRef.current,
      antialias: true
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.setZ(30);
    camera.position.setX(-3);

    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0.21;
    bloomPass.strength = 1.12;
    bloomPass.radius = 0.55;
    composer.addPass(bloomPass);

    const pointLight = new THREE.PointLight(0xffffff);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(pointLight, ambientLight);

    const spaceTexture = new THREE.TextureLoader().load('space.jpg');
    scene.background = spaceTexture;
// Star generation function
function addStar() {
  const starGeometry = new THREE.SphereGeometry(0.25, 24, 24);
  const starMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(starGeometry, starMaterial);
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}
Array(200).fill().forEach(addStar);



    const loader = new GLTFLoader();
    loader.load('blue_dragon/scene.gltf', (gltf) => {
      const dragon = gltf.scene;
      dragon.scale.set(100, 100, 100);
      scene.add(dragon);

      const dragonMixer = new THREE.AnimationMixer(dragon);
      mixers.current.push(dragonMixer);
      if (gltf.animations.length > 0) {
        const action = dragonMixer.clipAction(gltf.animations[0]);
        action.play();
      }
    }, undefined, function (error) {
      console.error('An error happened loading the GLTF model:', error);
    });

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
    });

    window.addEventListener('mousemove', (event) => {
      const deltaX = event.clientX - lastMousePosition.current.x;
      const deltaY = event.clientY - lastMousePosition.current.y;
      lastMousePosition.current.x = event.clientX;
      lastMousePosition.current.y = event.clientY;

      cameraRotation.current.y -= deltaX * 0.002;
      cameraRotation.current.x -= deltaY * 0.002;
      camera.rotation.y = cameraRotation.current.y;
      camera.rotation.x = cameraRotation.current.x;
    });

    document.body.onscroll = () => {
      const t = document.body.getBoundingClientRect().top;
      camera.position.z = t * -0.01;
      camera.position.x = t * -0.0002;
    };

    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      mixers.current.forEach((mixer) => mixer.update(delta));
      composer.render();
    };
    animate();

    return () => {
      window.removeEventListener('mousemove');
      mixers.current.forEach(mixer => mixer.stopAllAction());
      renderer.dispose();
    };
  }, []);

  return <canvas ref={rendererRef} {...props} />;
});

export default ThreeBackground;
