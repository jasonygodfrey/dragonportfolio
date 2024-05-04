import React, { useEffect, useRef, forwardRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const ThreeBackground = forwardRef((props, ref) => {
  const rendererRef = useRef(null);
  const mixerRef = useRef(null); // Ref to hold the animation mixer
  const lastMousePosition = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const cameraRotation = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas: rendererRef.current,
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.setZ(30);
    camera.position.setX(-3);

    // Lighting setup
    const pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(5, 5, 5);
    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(pointLight, ambientLight);

    // Torus geometry
    const torusGeometry = new THREE.TorusGeometry(10, 3, 16, 100);
    const torusMaterial = new THREE.MeshStandardMaterial({ color: 0xff6347 });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    scene.add(torus);

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

    // Background texture
    const spaceTexture = new THREE.TextureLoader().load('space.jpg');
    scene.background = spaceTexture;

    // GLTF model loading
    const loader = new GLTFLoader();
    loader.load('blue_dragon/scene.gltf', (gltf) => {
      const dragon = gltf.scene;
      dragon.scale.set(100, 100, 100); // Scale up the dragon
      scene.add(dragon);

      // Animation Mixer for dragon
      mixerRef.current = new THREE.AnimationMixer(dragon);
      if (gltf.animations.length > 1) {
        const action = mixerRef.current.clipAction(gltf.animations[1]);
        action.play();
      } else {
        console.error("Insufficient animations in GLTF model.");
      }

    }, undefined, function (error) {
      console.error('An error happened loading the GLTF model:', error);
    });

    loader.load('/portal/scene.gltf', (gltf) => {
      scene.add(gltf.scene);
      gltf.scene.scale.set(0.1, 0.1, 0.1);
      gltf.scene.position.set(0, -80, -300);
      gltf.scene.rotation.y = Math.PI / 2.2;

      if (gltf.animations && gltf.animations.length) {
        const portalMixer = new THREE.AnimationMixer(gltf.scene);
        gltf.animations.forEach((clip) => {
          const action = portalMixer.clipAction(clip);
          action.play();
        });
        //mixers.push(portalMixer);
      }
    });

    // Mouse movement listener
    function onMouseMove(event) {
      const deltaX = event.clientX - lastMousePosition.current.x;
      const deltaY = event.clientY - lastMousePosition.current.y;

      lastMousePosition.current.x = event.clientX;
      lastMousePosition.current.y = event.clientY;

      // Update camera rotation incrementally
      cameraRotation.current.y -= deltaX * 0.002;
      cameraRotation.current.x -= deltaY * 0.002;

      camera.rotation.y = cameraRotation.current.y;
      camera.rotation.x = cameraRotation.current.x;
    }
    window.addEventListener('mousemove', onMouseMove);

    // Scroll-based camera movement
    function moveCamera() {
      const t = document.body.getBoundingClientRect().top;
      camera.position.z = t * -0.01;
      camera.position.x = t * -0.0002;
      // Optional: adjust camera rotation based on scroll if desired
    }
    document.body.onscroll = moveCamera;
    moveCamera();

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      torus.rotation.x += 0.01;
      torus.rotation.y += 0.005;
      torus.rotation.z += 0.01;

      // Update the animation mixer every frame
      if (mixerRef.current) {
        const delta = clock.getDelta();
        mixerRef.current.update(delta);
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (mixerRef.current) mixerRef.current.stopAllAction();
      renderer.dispose(); // Cleanup WebGL resources
    };
  }, []);

  return <canvas ref={rendererRef} {...props} />;
});

export default ThreeBackground;
