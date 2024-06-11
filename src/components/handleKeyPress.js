import * as THREE from 'three';

export function handleKeyPress(move) {
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

  return () => {
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
  };
}

export function updateCameraPosition(camera, move, delta) {
  const moveForward = new THREE.Vector3();
  const moveRight = new THREE.Vector3();

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
}
