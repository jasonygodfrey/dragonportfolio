import React, { useEffect, useRef, forwardRef } from 'react';
import * as THREE from 'three';
import { Raycaster, Vector2 } from 'three';
import { setupScene } from './setupScene';
import { createStars } from './createStars';
import { loadDragon } from './loadDragon';
import { loadPortal } from './loadPortal';

const ThreeBackground = forwardRef((props, ref) => {
  const rendererRef = useRef(null);
  const mixers = useRef([]); // Array to hold all AnimationMixers
  const lastMousePosition = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const cameraRotation = useRef({ x: 0, y: 0 });

  const raycaster = new Raycaster();
  const mouse = new Vector2();
  const mouseMovement = useRef({ x: 0, y: 0 });

  const targetMousePosition = useRef({ x: 0, y: 0 });
  const currentMousePosition = useRef({ x: 0, y: 0 });

  const k = 100; // Spring stiffness
  const d = 0.1; // Damping factor
  const damping = 0.1; // Damping for smooth stop
  const returnSpeed = 2; // Speed for returning to initial position when not hovered

  const move = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    up: false,
    down: false,
  };
  const animationTriggered = useRef(false);

  useEffect(() => {
    const { scene, camera, composer, renderer } = setupScene(rendererRef);
    const stars = createStars(scene);

    const textureLoader = new THREE.TextureLoader();
    
    // Load and setup the jasongodfreydev.png texture
    const jasongodfreyTexture = textureLoader.load(
      'jasongodfreydev.png',
      (texture) => console.log('Texture loaded:', texture),
      undefined,
      (err) => console.error('An error occurred loading the texture:', err)
    );

    const originalWidth = 200; // Example original width of the image
    const originalHeight = 43; // Example original height of the image
    const aspectRatio = originalWidth / originalHeight;
    const screenWidth = window.innerWidth;
    const jasongodfreyWidth = screenWidth * 0.5; // Scale it to 50% of screen width
    const jasongodfreyHeight = jasongodfreyWidth / aspectRatio;

    const jasongodfreyGeometry = new THREE.PlaneGeometry(jasongodfreyWidth, jasongodfreyHeight);
    const jasongodfreyMaterial = new THREE.MeshBasicMaterial({
      map: jasongodfreyTexture,
      transparent: true,
      opacity: 0.000000000000025, // Set to your desired opacity level (0.0 to 1.0)
    });
    const jasongodfreyMesh = new THREE.Mesh(jasongodfreyGeometry, jasongodfreyMaterial);
    jasongodfreyMesh.position.set(0, -30, -270);
    scene.add(jasongodfreyMesh);

       // Load and setup the clouds1.png texture
  // Load and setup the clouds1.png texture
   // Load and setup the clouds2.png texture
   const cloudPositions = [
    { x: 0, y: -10, z: -100 },
    { x: -300, y: 150, z: -150 },
    { x: 300, y: 200, z: -200 },
    { x: 200, y: 50, z: -350 },
    { x: -200, y: 120, z: -500 },
    { x: 400, y: 80, z: -550 },
  ];

  const cloudsTexture = textureLoader.load(
    'cloud2.png',
    (texture) => {
      cloudPositions.forEach((pos) => {
        const cloudsGeometry = new THREE.PlaneGeometry(
          160 + Math.random() * 50, // Randomize size
          80 + Math.random() * 25
        );
        const cloudsMaterial = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: 0.3 + Math.random() * 0.2, // Randomize opacity
        });
        const cloudsMesh = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
        cloudsMesh.position.set(pos.x, pos.y, pos.z); // Adjust position as needed
        cloudsMesh.rotation.z = Math.random() * Math.PI; // Randomize rotation
        //scene.add(cloudsMesh);
      });
    },
    undefined,
    (err) => console.error('An error occurred loading the clouds texture:', err)
  );
    // Add a point light to illuminate the stars
    const pointLight = new THREE.PointLight(0xffffff, 1, 1000);
    pointLight.position.set(50, 50, 50);
    scene.add(pointLight);

    loadDragon(scene, mixers, animationTriggered);
    loadPortal(scene, mixers);

    const moveForward = new THREE.Vector3();
    const moveRight = new THREE.Vector3();
    const moveUp = new THREE.Vector3(0, 1, 0);

    const onKeyDown = (event) => {
      switch (event.key.toLowerCase()) {
        case 'w':
          move.forward = true;
          break;
        case 's':
          move.backward = true;
          break;
        case 'a':
          move.left = true;
          break;
        case 'd':
          move.right = true;
          break;
        case 'q':
          move.up = true;
          break;
        case 'e':
          move.down = true;
          break;
      }
    };

    const onKeyUp = (event) => {
      switch (event.key.toLowerCase()) {
        case 'w':
          move.forward = false;
          break;
        case 's':
          move.backward = false;
          break;
        case 'a':
          move.left = false;
          break;
        case 'd':
          move.right = false;
          break;
        case 'q':
          move.up = false;
          break;
        case 'e':
          move.down = false;
          break;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    const updateOpacityOnScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const opacity = Math.max(0, 0.2 - scrollTop * 0.0001); // Adjust the factor for fading
      jasongodfreyMesh.material.opacity = opacity;
    };

    const updateCameraPosition = () => {
      const scrollTop = document.body.getBoundingClientRect().top;
      camera.position.z = 30 + scrollTop * 0.02;
      camera.position.x = -3 + scrollTop * -0.0002;
      
      updateOpacityOnScroll(); // Call the function to update opacity
    };

    updateCameraPosition();

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

    document.body.onscroll = updateCameraPosition;

    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      mixers.current.forEach((mixer) => mixer.update(delta));

      updateOpacityOnScroll(); // Call the function to update opacity based on scroll

      currentMousePosition.current.x += (targetMousePosition.current.x - currentMousePosition.current.x) * 0.1;
      currentMousePosition.current.y += (targetMousePosition.current.y - currentMousePosition.current.y) * 0.1;

      mouse.x = currentMousePosition.current.x;
      mouse.y = currentMousePosition.current.y;
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(stars.map(star => star.interaction));

      stars.forEach((star) => {
        const isHovered = intersects.some((intersect) => intersect.object === star.interaction);
        if (isHovered) {
          if (!star.hovered) {
            star.mesh.material.color.set(`hsl(60, 100%, 75%)`);
            star.mesh.material.emissive.set(`hsl(60, 100%, 75%)`);
            star.hovered = true;
          }

          const displacement = new THREE.Vector3().copy(star.mesh.position).sub(new THREE.Vector3(star.xInitial, star.yInitial, star.zInitial));
          const velocity = new THREE.Vector3().copy(star.velocity);
          const force = displacement.multiplyScalar(-k).sub(velocity.clone().multiplyScalar(d));
          star.velocity.add(force.multiplyScalar(delta)).multiplyScalar(1 - damping);
          star.mesh.position.add(star.velocity.clone().multiplyScalar(delta));

        } else {
          if (star.hovered) {
            star.mesh.material.color.copy(star.defaultColor);
            star.mesh.material.emissive.copy(star.defaultColor);
            star.hovered = false;
          }

          star.velocity.multiplyScalar(1 - damping);
          const toInitial = new THREE.Vector3(star.xInitial, star.yInitial, star.zInitial).sub(star.mesh.position);
          star.mesh.position.add(toInitial.multiplyScalar(delta * returnSpeed));
        }

        const offsetX = mouseMovement.current.x * star.zInitial * 0.01;
        const offsetY = mouseMovement.current.y * star.zInitial * 0.01;
        star.mesh.position.x += offsetX;
        star.mesh.position.y += offsetY;
        star.interaction.position.copy(star.mesh.position);
      });

      const moveSpeed = 30 * delta;
      if (move.forward) {
        moveForward.setFromMatrixColumn(camera.matrix, 0).negate();
        camera.position.addScaledVector(moveForward, moveSpeed);
      }
      if (move.backward) {
        moveForward.setFromMatrixColumn(camera.matrix, 0);
        camera.position.addScaledVector(moveForward, moveSpeed);
      }
      if (move.left) {
        moveRight.setFromMatrixColumn(camera.matrix, 0).negate();
        camera.position.addScaledVector(moveRight, moveSpeed);
      }
      if (move.right) {
        moveRight.setFromMatrixColumn(camera.matrix, 0);
        camera.position.addScaledVector(moveRight, moveSpeed);
      }
      if (move.up) {
        camera.position.y += moveSpeed;
      }
      if (move.down) {
        camera.position.y -= moveSpeed;
      }

      composer.render();
    };
    animate();

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('mousemove', onMouseMove);
      mixers.current.forEach((mixer) => mixer.stopAllAction());
      renderer.dispose();
    };
  }, []);

  const onMouseMove = (event) => {
    targetMousePosition.current.x = (event.clientX / window.innerWidth) * 2 - 1;
    targetMousePosition.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    mouseMovement.current.x = (event.clientX - window.innerWidth / 2) * 0.001;
    mouseMovement.current.y = (event.clientY - window.innerHeight / 2) * 0.001;
  };

  window.addEventListener('mousemove', onMouseMove, false);

  return <canvas ref={rendererRef} {...props} />;
});

export default ThreeBackground;
