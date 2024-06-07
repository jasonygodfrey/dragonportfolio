import * as THREE from 'three';

export function createStars(scene) {
  const textureLoader = new THREE.TextureLoader();
  const starTexture = textureLoader.load('particles.png');

  const stars = [];
  const numArms = 4; // Reduced number of spiral arms
  const armSeparationAngle = (2 * Math.PI) / numArms;
  const armOffsetMax = 100; // Reduced max distance stars can be offset from the spiral arms
  const numStars = 0; // Reduced number of stars for better performance
  const spiralDensity = 0.1; // Adjust density for visibility
  const xOffset = 0; // Additional offset to move stars further along the x-axis
  const yOffset = 0; // Additional offset to move stars further along the y-axis
  const zOffset = 0; // Additional offset to move stars further along the z-axis

  function addStar() {
    const starGeometry = new THREE.SphereGeometry(1, 8, 8); // Simplified geometry
    const starColor = new THREE.Color('hsl(30, 100%, 50%)'); // Lantern orange color
    const starMaterial = new THREE.MeshStandardMaterial({
      map: starTexture,
      emissive: starColor,
      emissiveIntensity: THREE.MathUtils.randFloat(0.5, 0.8),
      opacity: 0.8,
      transparent: true,
    });
    const star = new THREE.Mesh(starGeometry, starMaterial);

    const interactionSphere = new THREE.Mesh(
      new THREE.SphereGeometry(2, 3, 3),
      new THREE.MeshBasicMaterial({ visible: false })
    );

    const y = THREE.MathUtils.randFloatSpread(200) + yOffset;

    const armIndex = Math.floor(Math.random() * numArms);
    const armAngle = armIndex * armSeparationAngle;
    const spiralRadius = Math.random() * 50 + 10;
    const angle = spiralDensity * spiralRadius;
    const offset = Math.random() * armOffsetMax - armOffsetMax / 2;

    star.position.set(
      spiralRadius * Math.cos(angle + armAngle) + offset + xOffset,
      y,
      spiralRadius * Math.sin(angle + armAngle) + offset + zOffset
    );
    interactionSphere.position.copy(star.position);

    scene.add(star);
    scene.add(interactionSphere);

    stars.push({
      mesh: star,
      interaction: interactionSphere,
      yInitial: star.position.y,
      xInitial: star.position.x,
      zInitial: star.position.z,
      defaultColor: starColor,
      hovered: false,
      velocity: new THREE.Vector3(),
    });

    console.log(`Added star at position: (${star.position.x}, ${star.position.y}, ${star.position.z})`);
  }

  Array(numStars).fill().forEach(addStar);

  return stars;
}
