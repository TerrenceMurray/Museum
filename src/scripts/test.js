"use strict";

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { HDRILoader } from "../scripts/loaders/HDRILoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/rgbeloader.js";

let url = new URL("../objects/environment.gltf", import.meta.url);

const scene = new THREE.Scene();
// Renderer
const renderer = new THREE.WebGLRenderer( { antialias: true } );

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

// --> Colour Space
renderer.outputEncoding = THREE.sRGBEncoding;
// --> Tone Mapping
renderer.toneMapping = THREE.ACESFilmicToneMapping;
// --> Tone Mapping Exposure
renderer.toneMappingExposure = 1.8;

document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.z = 8;

const controls = new OrbitControls(camera, renderer.domElement);

const gridHelper = new THREE.GridHelper();
scene.add(gridHelper);

// HDRI

const objectLoader = new GLTFLoader();

// GLTF
new HDRILoader({ scene: scene, url: new URL("../textures/MR_INT-003_Kitchen_Pierre.hdr", import.meta.url), isBackground: true, isEnvironment: true }).load(() => {
    
    objectLoader.load( "./environment.00c95094.gltf", function(gltf) {
        gltf.scene.scale.set(1, 1, 1);
        gltf.scene.position.set(0, 0, 0);
        scene.add(gltf.scene);
    } );
});
// new RGBELoader().load( new URL("../textures/MR_INT-003_Kitchen_Pierre.hdr", import.meta.url ), texture => { 
//     texture.mapping = THREE.EquirectangularReflectionMapping;
    
//     scene.background = texture;
//     scene.environment = texture;
    
//     objectLoader.load( "./environment.00c95094.gltf", function(gltf) {
//         gltf.scene.scale.set(1, 1, 1);
//         gltf.scene.position.set(0, 0, 0);
//         scene.add(gltf.scene);
//     } );
// } );

const Update = () => {
    requestAnimationFrame(Update);
    renderer.render(scene, camera);
}

Update();