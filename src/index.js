"use strict";
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import textureblg from "../models/textureblg.glb";
import untitled_candele from '../models/untitled_candele.glb';
import bladee from '../sounds/bladee.wav';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
scene.fog = new THREE.Fog(0xffffff, 1, 10);

const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
light.position.set(0.5, 1, 0.75);
scene.add(light);

const camera = new THREE.PerspectiveCamera(
  90,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", function () {
  var width = window.innerWidth;
  var height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

const controls = new PointerLockControls(camera, renderer.domElement);
window.addEventListener(
  "click",
  function () {
    controls.lock();
  },
  false
);

let moveForward = false;
let moveLeft = false;
let moveBackward = false;
let moveRight = false;
let moveUpward = false;
let moveDownward = false;

const onKeyDown = function (event) {
  switch (event.code) {
    case "ArrowUp":
    case "KeyW":
      moveForward = true;
      break;

    case "ArrowLeft":
    case "KeyA":
      moveLeft = true;
      break;

    case "ArrowDown":
    case "KeyS":
      moveBackward = true;
      break;

    case "ArrowRight":
    case "KeyD":
      moveRight = true;
      break;

    case "KeyR":
      moveUpward = true;
      break;

    case "KeyF":
      moveDownward = true;
      break;
  }
};

const onKeyUp = function (event) {
  switch (event.code) {
    case "ArrowUp":
    case "KeyW":
      moveForward = false;
      break;

    case "ArrowLeft":
    case "KeyA":
      moveLeft = false;
      break;

    case "ArrowDown":
    case "KeyS":
      moveBackward = false;
      break;

    case "ArrowRight":
    case "KeyD":
      moveRight = false;
      break;

    case "KeyR":
      moveUpward = false;
      break;

    case "KeyF":
      moveDownward = false;
      break;
  }
};

document.addEventListener("keydown", onKeyDown);
document.addEventListener("keyup", onKeyUp);
const loader = new GLTFLoader();
loader.load(textureblg, function (gltf) {
  const model = gltf.scene;
  scene.add(model);
});

loader.load(untitled_candele, function (gltf) {
  const modelone = gltf.scene;
  scene.add(modelone);
});

const listener = new THREE.AudioListener();
camera.add(listener);
const sound = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader();
audioLoader.load(bladee, function (buffer) {
  sound.setBuffer(buffer);
  sound.setLoop(true);
  sound.setVolume(0.5);
  //sound.play ();
});

const direction = new THREE.Vector3();
let acceleration = new THREE.Vector3();
let velocity = new THREE.Vector3();
const maxAccel = 5.0;
const maxSpeed = 2.7;
const c = 0.15;
const frictionC = 1 - 1 * c;

let prevTime = performance.now();
function updateControls() {
  const time = performance.now();
  const delta = (time - prevTime) / 1000;
  direction.x = Number(moveRight) - Number(moveLeft);
  direction.y = Number(moveUpward) - Number(moveDownward);
  direction.z = Number(moveForward) - Number(moveBackward);
  direction.normalize();

  direction.multiplyScalar(maxAccel * delta * maxSpeed);

  velocity.add(direction);
  velocity.multiplyScalar(frictionC);

  controls.moveForward(velocity.z * delta);
  controls.moveRight(velocity.x * delta);
  camera.position.y += velocity.y * delta;
  prevTime = time;
}

const onWheel = function ({ deltaY }) {
  if (deltaY < 0) {
    velocity.y += 1;
  } else {
    velocity.y -= 1;
  }
};
document.addEventListener("wheel", onWheel);

var animate = function () {
  requestAnimationFrame(animate);
  updateControls();
  renderer.render(scene, camera);
};

animate();
