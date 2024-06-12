import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

class TextManager {
  constructor(scene, camera, renderer) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.fontLoader = new FontLoader();
    this.texts = [];
    this.loadFont();

    // Separate Raycaster for detecting clicks and hover
    this.raycaster2 = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.hoveredText = null;

    // Event listeners for mouse interactions
    if (this.renderer && this.renderer.domElement) {
      console.log('Attaching event listeners to renderer.domElement');
      this.renderer.domElement.addEventListener('pointerdown', this.onDocumentMouseClick.bind(this), false);
      this.renderer.domElement.addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false);
    } else {
      console.error('Renderer or renderer.domElement is not defined');
    }
  }

  loadFont() {
    this.fontLoader.load(
      'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
      (font) => {
        this.font = font;
        this.createTextSprite('Contact', 0, 50, 0, 'https://www.youtube.com');
      },
      undefined,
      (error) => {
        console.error('Error loading font:', error);
      }
    );
  }

  createTextSprite(text, x, y, z, url = null) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const fontSize = 100;
    context.font = `${fontSize}px Arial`;
    const textWidth = context.measureText(text).width;

    // Resize canvas to fit text
    canvas.width = textWidth;
    canvas.height = fontSize;
    context.font = `${fontSize}px Arial`;
    context.fillStyle = 'white';
    context.fillText(text, 0, fontSize);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);

    sprite.position.set(x, y, z);
    sprite.scale.set(canvas.width / 10, canvas.height / 10, 1); // Adjust scale as needed
    sprite.userData = { url, text, fontSize, textWidth, canvas, context, texture, originalColor: 'white' };

    // Create an invisible larger mesh for interaction
    const interactionGeometry = new THREE.PlaneGeometry(300, 300); // Increase the size of the clickable area
    const interactionMaterial = new THREE.MeshBasicMaterial({ visible: true, color: 0x00ff00, wireframe: true }); // Make the interaction mesh visible for debugging
    const interactionMesh = new THREE.Mesh(interactionGeometry, interactionMaterial);
    interactionMesh.position.set(x, y, z);
    interactionMesh.userData = sprite.userData;

    this.scene.add(sprite);
    this.scene.add(interactionMesh);
    this.texts.push(interactionMesh); // Add the interaction mesh to the raycaster list
  }

  updateTextColor(userData, color) {
    userData.context.clearRect(0, 0, userData.canvas.width, userData.canvas.height);
    userData.context.fillStyle = color;
    userData.context.fillText(userData.text, 0, userData.fontSize);
    userData.texture.needsUpdate = true;
  }

  onDocumentMouseMove(event) {
    // Calculate mouse position in normalized device coordinates
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the picking ray with the camera and mouse position
    this.raycaster2.setFromCamera(this.mouse, this.camera);

    // Calculate objects intersecting the picking ray
    const intersects = this.raycaster2.intersectObjects(this.texts);

    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object;
      this.visualizeIntersectionPoint(intersects[0].point); // Visualize the intersection point
      if (this.hoveredText !== intersectedObject) {
        if (this.hoveredText) {
          this.updateTextColor(this.hoveredText.userData, this.hoveredText.userData.originalColor);
        }
        this.hoveredText = intersectedObject;
        this.updateTextColor(this.hoveredText.userData, 'blue');
      }
    } else {
      if (this.hoveredText) {
        this.updateTextColor(this.hoveredText.userData, this.hoveredText.userData.originalColor);
        this.hoveredText = null;
      }
    }
  }

  onDocumentMouseClick(event) {
    console.log('Click event detected');
    event.preventDefault();

    // Calculate mouse position in normalized device coordinates
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    console.log(`Mouse coordinates: ${this.mouse.x}, ${this.mouse.y}`);

    // Update the picking ray with the camera and mouse position
    this.raycaster2.setFromCamera(this.mouse, this.camera);

    // Calculate objects intersecting the picking ray
    const intersects = this.raycaster2.intersectObjects(this.texts);

    console.log(`Intersects length: ${intersects.length}`);

    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object;
      console.log('Intersected object:', intersectedObject);
      this.visualizeIntersectionPoint(intersects[0].point); // Visualize the intersection point
      if (intersectedObject.userData.url) {
        console.log('Navigating to URL:', intersectedObject.userData.url);
        this.updateTextColor(intersectedObject.userData, 'red');
        setTimeout(() => {
          window.location.href = intersectedObject.userData.url;
        }, 100);
      }
    } else {
      console.log('No intersection detected');
    }
  }

  visualizeIntersectionPoint(point) {
    const geometry = new THREE.SphereGeometry(5, 32, 32);  // Increase the size for visibility
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.75 });
    const sphere2 = new THREE.Mesh(geometry, material);

    sphere2.position.copy(point);
    sphere2.position.z += 0.5;  // Adjust z to ensure it's in front of other objects if needed

    this.scene.add(sphere2);

    // Remove the sphere after a short duration
    setTimeout(() => {
      this.scene.remove(sphere2);
    }, 5000);
  }

  update() {
    // Update logic if needed
  }
}

export default TextManager;
