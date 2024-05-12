import React, { useEffect, useRef, forwardRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { Raycaster, Vector2 } from 'three';

const ThreeBackground2 = forwardRef((props, ref) => {
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
  const dragonRef = useRef(null);
  const animationTriggered = useRef(false);


  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000000000000);
    const renderer = new THREE.WebGLRenderer({
      canvas: rendererRef.current,
      antialias: true,
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.setZ(30);
    camera.position.setX(-3);

    // Rotate the camera to the right
    //camera.rotation.y = Math.PI / 4; // Rotate the camera to the right by 45 degrees


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

    // Add the 'jasongodfreydev.png' texture to the scene
    const textureLoader = new THREE.TextureLoader();

    console.log('Loading texture: jasongodfrey.png');
    const jasongodfreyTexture = textureLoader.load(
      'jasongodfreydev.png',
      function (texture) {
        // Texture loaded successfully
        console.log('Texture loaded:', texture);
      },
      undefined, // Progress callback
      function (err) {
        // Error callback
        console.error('An error occurred loading the texture:', err);
      }
    );

    // Scale to fit the screen width and maintain the original aspect ratio
    const originalWidth = 200; // Example original width of the image
    const originalHeight = 43; // Example original height of the image
    const aspectRatio = originalWidth / originalHeight;
    const screenWidth = window.innerWidth;
    const jasongodfreyWidth = screenWidth * 0.5; // Scale it to 50% of screen width
    const jasongodfreyHeight = jasongodfreyWidth / aspectRatio;

    const jasongodfreyGeometry = new THREE.PlaneGeometry(jasongodfreyWidth, jasongodfreyHeight);
    console.log('Geometry created:', jasongodfreyGeometry);

    const jasongodfreyMaterial = new THREE.MeshBasicMaterial({
      map: jasongodfreyTexture,
      transparent: true,
      opacity: 0.000000000000025, // Set to your desired opacity level (0.0 to 1.0)
    
    });
    console.log('Material created:', jasongodfreyMaterial);

    const jasongodfreyMesh = new THREE.Mesh(jasongodfreyGeometry, jasongodfreyMaterial);
    jasongodfreyMesh.position.set(0, -30, -270);
    console.log('Mesh created:', jasongodfreyMesh);

    scene.add(jasongodfreyMesh);
    console.log('Mesh added to the scene:', jasongodfreyMesh);

    const stars = [];
    function addStar() {
      const starGeometry = new THREE.SphereGeometry(0.045, 24, 24);
      const starColor = new THREE.Color(`hsl(${THREE.MathUtils.randFloat(30, 40)}, 100%, ${THREE.MathUtils.randFloat(50, 70)}%)`);
      const starMaterial = new THREE.MeshStandardMaterial({
        color: starColor,
        emissive: starColor,
        emissiveIntensity: THREE.MathUtils.randFloat(0.5, 1),
        opacity: 0.2,
        transparent: true,
      });
      const star = new THREE.Mesh(starGeometry, starMaterial);

      const interactionSphere = new THREE.Mesh(
        new THREE.SphereGeometry(2, 8, 8),
        new THREE.MeshBasicMaterial({ visible: false })
      );

      const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
      star.position.set(x, y, z);
      interactionSphere.position.copy(star.position);

      scene.add(star);
      scene.add(interactionSphere);

      stars.push({
        mesh: star,
        interaction: interactionSphere,
        yInitial: y,
        xInitial: x,
        zInitial: z,
        defaultColor: starColor,
        hovered: false,
        velocity: new THREE.Vector3(),
      });
    }
    Array(400).fill().forEach(addStar);


    const loader = new GLTFLoader();

      loader.load('blue_dragon/scene.gltf', (gltf) => {
        const dragon = gltf.scene;
        dragon.scale.set(10000, 10000, 10000);
        dragon.position.set(0, -250, -300);
        //scene.add(dragon);
        dragonRef.current = dragon;
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
              //secondAction.loop = THREE.LoopOnce;  // Ensure it only plays once
              
        
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
    }, undefined, function (error) {
      console.error('An error happened loading the GLTF model:', error);
    });

    const updateDragonWireframe = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollFraction = scrollTop / maxScroll;
      const wireframe = scrollFraction > 1.0; // Change to wireframe halfway through scrolling
    
      if (dragonRef.current) {
        dragonRef.current.traverse((child) => {
          if (child.isMesh) {
            child.material.wireframe = wireframe;
          }
        });
      }
    };
    
    window.addEventListener('scroll', updateDragonWireframe, false);
    

    loader.load('/spacedrive/scene.gltf', (gltf) => {
      const portal = gltf.scene;
      portal.scale.set(10000, 10000, 10000);
      portal.position.set(0, -80, -300);
  
      // Generate a random rotation between 1 and 10 degrees, converted to radians
      const randomRotationDegrees = 1 + Math.random() * 360; // Generate a number between 1 and 10
      const randomRotationRadians = randomRotationDegrees * (Math.PI / 180); // Convert degrees to radians
  
      portal.rotation.y = randomRotationRadians;
      portal.rotation.x = randomRotationRadians;
  
      scene.add(portal);
  
      const portalMixer = new THREE.AnimationMixer(portal);
      mixers.current.push(portalMixer);
      gltf.animations.forEach((clip) => {
          const action = portalMixer.clipAction(clip);
          action.play();
      });
      portalMixer.timeScale = 0.5;  // Slow down the animation speed
  });
  

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

      // Pulse opacity of the jasongodfreyMesh
      const time = clock.getElapsedTime();
      //jasongodfreyMesh.material.opacity = 0.285 + 0.1 * Math.sin(time * 2); // Adjust 0.1 to change the pulse amplitude

      // Move the camera based on the movement keys
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

export default ThreeBackground2;
