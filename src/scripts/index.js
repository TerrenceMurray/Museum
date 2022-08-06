"use strict";

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/gltfloader";
import { getStringFromURL } from "./lib/custom";
import { HDRILoader } from "./lib/loaders/HDRILoader";
// import { OrbitControls } from "three/examples/jsm/controls/orbitcontrols.js";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls.js";
import { InputController } from "./lib/controllers/InputController";

class MuseumDemo {
    
    constructor() {
        this._init();
        this._animate();
    }

    _loadObjects() {
        // Create HDRI
        const hdri_loader = new HDRILoader( { 
            scene: this.scene, 
            url: new URL( "../textures/MR_INT-003_Kitchen_Pierre.hdr", import.meta.url ) 
        } );

        hdri_loader.set( { renderer: this.renderer, exposure: 1.8 } );

        hdri_loader.load( () => {
            new GLTFLoader().load( 
                getStringFromURL( new URL( "../objects/environment.gltf", import.meta.url ) ), 
                gltf => {
                    gltf.scene.scale.set(5, 5, 5);
                    gltf.scene.position.set(0, 0, 0);
                    this.scene.add( gltf.scene );
                } 
            );
        } );
    }

    _init() {
        this.clock = new THREE.Clock(true);

        this._initScene();
        this._initRenderer();
        this._initCamera();
        this._initControls();

        this._loadObjects();
    }

    _initScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x202020 );
    }

    _initRenderer() {
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );

        this.renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

        this.renderer.pixelRatio = window.devicePixelRatio;
        document.body.appendChild( this.renderer.domElement );
    }

    _initCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        this.camera.position.set( 30, 30, 0 );
    }

    _initControls() {
        this.inputController = new InputController();

        this.controls = new FirstPersonControls( this.camera, this.renderer.domElement );
        this.controls.activeLook = false;
    }

    handleResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize( window.innerWidth, window.innerHeight );
        
        this._render();
    }

    _animate() {
        requestAnimationFrame(this._animate.bind( this ));
        
        if (this.inputController.isActive.leftClick === true && this.controls.activeLook === false) {
            this.controls.activeLook = true;
        } else if (this.inputController.isActive.leftClick === false && this.controls.activeLook === true) {
            this.controls.activeLook = false;
        }


        this._render();
    }

    _render() {
        this.renderer.render( this.scene, this.camera );
        this.controls.update( this.clock.getElapsedTime() * 0.1 );
    }
}

window.addEventListener( 'DOMContentLoaded' ,() => {
    const demo = new MuseumDemo();

    window.addEventListener( 'resize', () => {
        demo.handleResize();
    } );
} );