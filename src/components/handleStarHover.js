import * as THREE from 'three';

export function handleStarHover(stars, raycaster, mouse, mouseMovement, delta, k, d, damping, returnSpeed) {
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
}
