"use strict";

// Custom
import { getStringFromURL } from "./lib/custom";

// Base
import * as THREE from "three";

// Loaders
import { GLTFLoader } from "three/examples/jsm/loaders/gltfloader";
import { HDRILoader } from "./lib/loaders/HDRILoader";

// Controls
import { ClickDragControls } from "./lib/controls/ClickDragControls";

// ThreeJs Scene
class MuseumDemo {

    constructor() {
        this._init();
        this._animate();
    }

    _loadObjects() {
        // // Light
        const ambientLight = new THREE.AmbientLight( 0xfffff, 10 ); 
        this.scene.add( ambientLight );

        // Helper
        const helper = new THREE.GridHelper( 1000, 100 );
        this.scene.add(helper);

        // Cube
        const geo = new THREE.BoxGeometry( 2, 2, 2 );
        const mat = new THREE.MeshBasicMaterial( { color: 0xfefffe } );
        const cubeMesh = new THREE.Mesh( geo, mat );

        this.scene.add( cubeMesh );
    }
    
    // Initialise components
    _init() {
        this._initScene();
        this._initRenderer();
        this._initCamera();
        this._initControls();
        this._loadObjects();

        // Handle the resizing on window resize
        window.addEventListener( 'resize', () => {
            this._handleResize();
        } );
    }

    // Scene
    _initScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x202020 );
    }

    // Renderer
    _initRenderer() {
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );

        this.renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

        this.renderer.pixelRatio = window.devicePixelRatio;
        document.body.appendChild( this.renderer.domElement );
    }

    // Camera
    _initCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        this.camera.position.z = 10;
        this.camera.position.y = 2;
    }

    // Controls
    _initControls() {
        this.controls = new ClickDragControls( this.camera, this.renderer.domElement );
    }

    // Handle resizing
    _handleResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize( window.innerWidth, window.innerHeight );
        
        this._render();
    }

    _animate() {
        requestAnimationFrame(this._animate.bind( this ));

        this._render();
    }

    _render() {
        this.renderer.render( this.scene, this.camera );
    }
}

// Instantiate the ThreeJs when the document is loaded
window.addEventListener( 'DOMContentLoaded' ,() => {
    const demo = new MuseumDemo();
} );