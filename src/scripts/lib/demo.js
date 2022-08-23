"use strict";

// Custom
import { getStringFromURL } from "./abstracts/custom";

// Base
import * as THREE from "three";

// Loaders
import { GLTFLoader } from "three/examples/jsm/loaders/gltfloader";
import { HDRILoader } from "./loaders/HDRILoader";

// Controls
import { ClickDragControls } from "./controls/ClickDragControls";

// ThreeJs Scene
export class MuseumDemo {

    constructor() {
        this._init();
        this._animate();
    }

    _loadObjects() {
        //#region HDRI

        // Create HDRI
        // const hdri_loader = new HDRILoader( { 
        //     scene: this.scene, 
        //     url: new URL( "../textures/MR_INT-003_Kitchen_Pierre.hdr", import.meta.url ) 
        // } );

        // hdri_loader.set( { renderer: this.renderer, exposure: 1.8 } );

        // hdri_loader.load( () => {
        //     new GLTFLoader().load( 
        //         getStringFromURL( new URL( "../objects/environment.gltf", import.meta.url ) ), 
        //         gltf => {
        //             gltf.scene.scale.set(5, 5, 5);
        //             gltf.scene.position.set(0, 0, 0);
        //             this.scene.add( gltf.scene );
        //         } 
        //     );
        // } );
        
        //#endregion

        // Light
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