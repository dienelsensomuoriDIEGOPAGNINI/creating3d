"use strict";
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { BloomEffect, RenderPass, EffectPass, EffectComposer } from "postprocessing";;
import GLBcomp1_compressed from '../models/GLBcomp1_compressed.glb';
import GLBcomp2_compressed from '../models/GLBcomp2_compressed.glb';
import GLBcomp3_compressed from '../models/GLBcomp3_compressed.glb';
import ambient_sound from '../sounds/ambient_die.wav';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const upColor = 0xFFFF80
const downColor = 0x4040FF
const light = new THREE.HemisphereLight(upColor, downColor, 1.0);
light.position.set(0.5, 1, 0.75);
scene.add(light);

var ambient = new THREE.AmbientLight( 0xffffff);
ambient.intensity = 0.2;
scene.add( ambient );

var directionalLight = new THREE.DirectionalLight( 0xffffff );
directionalLight.position.set( 0, 0, 1 );
scene.add( directionalLight );

const camera = new THREE.PerspectiveCamera(
  90,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 50;

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
  true
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

//MUSICA
const listener = new THREE.AudioListener();
camera.add( listener );
const sound = new THREE.Audio( listener );
const audioLoader = new THREE.AudioLoader();
audioLoader.load( ambient_sound, function( buffer ) {
	sound.setBuffer( buffer );
  sound.setLoop( true );
  sound.autoplay = true;
	sound.setVolume( 1 );
	sound.play( true );
});

// hey diego!
// LOAD MODELLI
const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath( 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/' );
loader.setDRACOLoader (dracoLoader);
let model;
loader.load( GLBcomp1_compressed, function (gltf) {
  model = gltf.scene;
  model.scale.set (10,10,10);
  model.position.set (-5,-30,0);
  scene.add(model);
});



let modelone;
loader.load(GLBcomp2_compressed, function (gltf) {
  modelone = gltf.scene;
  modelone.scale.set (8,8,8);
  modelone.rotation.y = 180;
  modelone.position.set (0,-20,0);
  modelone.visible = false;
  scene.add(modelone); 
});

let comp3;
loader.load(GLBcomp3_compressed, function (gltf) {
  comp3 = gltf.scene;
  comp3.scale.set (10,10,10);
  comp3.rotation.y = 130;
  comp3.position.set (0,-20,0);
  comp3.visible = false;
  scene.add(comp3); 
});
  
  const composer = new EffectComposer (renderer);
  composer.addPass (new RenderPass (scene, camera));

  let effectPass = new EffectPass (
    camera,
    new BloomEffect ()
  );
  effectPass.renderToScreen = true;
  composer.addPass (effectPass);

const direction = new THREE.Vector3();
let acceleration = new THREE.Vector3();
let velocity = new THREE.Vector3();
const maxAccel = 5.0;
const maxSpeed = 2.7;
const c = 0.15;
const frictionC = 1 - 1 * c;
const v = 2;

let prevTime = performance.now();
function updateControls() {
  const time = performance.now();
  const delta = (time - prevTime) / 1000 * v;
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
    velocity.y += 2;
  } else {
    velocity.y -= 2;
  }
};
document.addEventListener("wheel", onWheel);

function onClick ( ) {
  if (model.visible) {
    model.visible = false;
    modelone.visible = true;
    comp3.visible = false;
  } else if (modelone.visible) {
    modelone.visible = false;
    model.visible = false;
    comp3.visible = true;
  } else if (comp3.visible) {
    comp3.visible = false;
    modelone.visible = false;
    model.visible = true;
  }
}

document.addEventListener ( "click", onClick);

var animate = function () {
  requestAnimationFrame(animate);
  updateControls();
  if ( model ) {
    model.rotation.y += 0.001;
  }
  if ( modelone ) {
    modelone.rotation.y += 0.001;
  }
  if ( comp3 ) {
    comp3.rotation.y += 0.001;
  }
  composer.render( scene );
};

animate();
