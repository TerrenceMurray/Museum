"use strict";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/orbitcontrols.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { HDRILoader } from "../scripts/loaders/HDRILoader.js";


// const HDRI = new URL("../textures/MR_INT-003_Kitchen_Pierre.hdr", import.meta.url);
const Environment = new URL ("../objects/environment.gltf", import.meta.url);

let _scene, _camera, _renderer;

function init() {
    // Scene
    _scene = new THREE.Scene();

    // Renderer
    _renderer = new THREE.WebGLRenderer( { antialias: true } );

    _renderer.setSize( window.innerWidth, window.innerHeight );
    _renderer.setPixelRatio( window.devicePixelRatio );
    document.body.appendChild( _renderer.domElement );

    // Camera
    _camera = new THREE.PerspectiveCamera( 
        75, 
        window.innerWidth / window.innerHeight, 
        0.1, 
        1000 
    );
    
    _camera.position.z = 5;

    // Controls
    const controls = new OrbitControls( _camera, _renderer.domElement );

    // GLTF Loader
    const objectLoader = new GLTFLoader();
    
    // HDRI Loader
    const loader = new HDRILoader({ 
        scene: _scene, 
        url: new URL("../textures/MR_INT-003_Kitchen_Pierre.hdr", import.meta.url), 
        isBackground: false, 
        isEnvironment: true 
    });
    
    // Set appropriate settings for renderer
    loader.set({ renderer: _renderer, exposure: 1.8 });

    loader.load(() => {
        objectLoader.load( getStringFromURL(Environment), function(gltf) {
            gltf.scene.scale.set(1, 1, 1);
            gltf.scene.position.set(0, 0, 0);
            _scene.add(gltf.scene);
        } );
    });

    // Event Listeners
    window.addEventListener( 'resize', onWindowResize );
}

function getStringFromURL(url) {
    return ".".concat(url.pathname);
}

function onWindowResize() {
    _camera.aspect = window.innerWidth / window.innerHeight;
    _camera.updateProjectionMatrix();

    _renderer.setSize( window.innerWidth, window.innerHeight );
}

function render() {
    _renderer.render( _scene, _camera );

}

function animate() {
    requestAnimationFrame( animate );

    render();
}

init();
animate();