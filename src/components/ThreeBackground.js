import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { setupScene } from './setupScene';
import { createStars } from './createStars';
import { loadDragon } from './loadDragon';
import { loadPortal } from './loadPortal';
import { handleStarHover } from './handleStarHover';
import { handleKeyPress } from './handleKeyPress';

const ThreeBackground = (props) => {
  const rendererRef = useRef(null);
  const mixers = useRef([]); // Array to hold all AnimationMixers
  const animationsRef = useRef([]); // Array to hold all animations
  const currentAnimationIndex = useRef(0); // Current animation index
  const lastMousePosition = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const cameraRotation = useRef({ x: 0, y: 0 });

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
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
      opacity: 0.5, // Set to your desired opacity level (0.0 to 1.0)
      side: THREE.DoubleSide, // Ensure the texture is visible from both sides
    });
    const jasongodfreyMesh = new THREE.Mesh(jasongodfreyGeometry, jasongodfreyMaterial);
    jasongodfreyMesh.position.set(0, -30, -270);
    scene.add(jasongodfreyMesh);

    // Add a point light to illuminate the stars
    const pointLight = new THREE.PointLight(0xffffff, 1, 1000);
    pointLight.position.set(50, 50, 50);
    scene.add(pointLight);

    // Add a red circle in front of the camera
    const circleGeometry = new THREE.CircleGeometry(0, 0);
    const circleMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const circleMesh = new THREE.Mesh(circleGeometry, circleMaterial);
    circleMesh.position.set(0, 0, -200);
    //scene.add(circleMesh);

    // Load Dragon and Portal
    loadDragon(scene, mixers, animationTriggered, animationsRef, currentAnimationIndex);
    loadPortal(scene, mixers);

    const cleanUpKeyPress = handleKeyPress(move);

    // Update opacity on scroll
    const updateOpacityOnScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const opacity = Math.max(0, 0.2 - scrollTop * 0.0001); // Adjust the factor for fading
      jasongodfreyMesh.material.opacity = opacity;
    };

    // Mouse move event
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

    // Create Contact text
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const fontSize = 100;
    context.font = `${fontSize}px Arial`;
    const textWidth = context.measureText('Contact').width;

    // Resize canvas to fit text
    canvas.width = textWidth;
    canvas.height = fontSize;
    context.font = `${fontSize}px Arial`;
    context.fillStyle = 'white';
    context.fillText('Contact', 0, fontSize);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);

    sprite.position.set(0, 50, 0);
    sprite.scale.set(canvas.width / 10, canvas.height / 10, 1); // Adjust scale as needed
    sprite.userData = { url: 'https://www.linkedin.com/in/jasong7/', originalColor: 'white', texture, canvas, context };

    // Add the sprite to the scene
    scene.add(sprite);

    // Interaction mesh for Contact text
    const interactionGeometry = new THREE.PlaneGeometry(100, 50); // Increase the size of the clickable area
    const interactionMaterial = new THREE.MeshBasicMaterial({ visible: true, color: 0x00ff00, wireframe: true }); // Make the interaction mesh visible for debugging
    const interactionMesh = new THREE.Mesh(interactionGeometry, interactionMaterial);
    interactionMesh.position.set(0, 50, 0);
    interactionMesh.userData = sprite.userData;
    scene.add(interactionMesh);

    // Raycasting and interaction handling
    const handleMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects([interactionMesh]);

      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        if (sprite.userData !== intersectedObject.userData) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.fillStyle = 'blue';
          context.fillText('Contact', 0, fontSize);
          texture.needsUpdate = true;
        }
      } else {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'white';
        context.fillText('Contact', 0, fontSize);
        texture.needsUpdate = true;
      }
    };

    const handleMouseClick = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects([interactionMesh]);

      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        if (intersectedObject.userData.url) {
          window.location.href = intersectedObject.userData.url;
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleMouseClick);

    const clock = new THREE.Clock();
    let angle = (30 * Math.PI) / 180; // Start angle at 30 degrees
    let direction = 1; // 1 for forward, -1 for backward
    const radius = 600; // Radius for circular motion
    const initialCameraZ = -400; // Initial position further back
    const minAngle = (30 * Math.PI) / 180; // Minimum angle for 30 degrees
    const maxAngle = (150 * Math.PI) / 180; // Maximum angle for 150 degrees

    camera.position.set(0, 50, initialCameraZ); // Set initial camera position further back
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

      handleStarHover(stars, raycaster, mouse, mouseMovement, delta, k, d, damping, returnSpeed);

      angle += delta * 0.05 * direction; // Adjust speed of rotation

      if (angle >= maxAngle || angle <= minAngle) {
        direction *= -1; // Reverse direction when reaching the ends
      }

      camera.position.x = radius * Math.cos(angle) + mouseMovement.current.x * 50; // Add mouse parallax
      camera.position.z = initialCameraZ + radius * Math.sin(angle) + mouseMovement.current.y * 50; // Add mouse parallax
      camera.position.y = -50 + mouseMovement.current.y * 50; // Adjust for vertical mouse movement
      camera.lookAt(circleMesh.position);

      // Update star positions to animate in a spiral
      stars.forEach(star => {
        const spiralAngle = delta * 1.0; // Increase the factor to make the spiral faster
        star.angle += spiralAngle;
        star.spiralRadius += spiralAngle * 1.0; // Increase the factor for faster spiral expansion
        star.mesh.position.x = star.spiralRadius * Math.cos(star.angle) + star.offset;
        star.mesh.position.z = star.spiralRadius * Math.sin(star.angle) + star.offset;
        star.mesh.position.y = star.initialY;
        star.interaction.position.copy(star.mesh.position);
      });

      composer.render();
    };
    animate();

    return () => {
      cleanUpKeyPress();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleMouseClick);
      window.removeEventListener('mousemove', onMouseMove);
      mixers.current.forEach((mixer) => mixer.stopAllAction());
      renderer.dispose();
    };
  }, []);

  const onMouseMove = (event) => {
    targetMousePosition.current.x = (event.clientX / window.innerWidth) * 2 - 1;
    targetMousePosition.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    mouseMovement.current.x = (event.clientX - window.innerWidth / 2) * 0.001;
    mouseMovement.current.y = (event.clientX - window.innerHeight / 2) * 0.001;
  };

  window.addEventListener('mousemove', onMouseMove, false);

  return <canvas ref={rendererRef} {...props} />;
};

export default ThreeBackground;
