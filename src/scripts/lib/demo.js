"use strict";

// Custom
import { getStringFromURL, Overlay } from "./abstracts/custom";

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
        // #region HDRI

        // Create HDRI
        const hdri_loader = new HDRILoader( { 
            scene: this.scene, 
            url: new URL( "../../textures/sunset_in_the_chalk_quarry_1k.hdr", import.meta.url ),
            manager: this.loadingManager
        } );

        hdri_loader.set( { renderer: this.renderer, exposure: 1.8 } );

        hdri_loader.load( () => {
            new GLTFLoader( this.loadingManager ).load( 
                getStringFromURL( new URL( "../../objects/environment.gltf", import.meta.url ) ), 
                gltf => {
                    gltf.scene.scale.set(5, 5, 5);
                    gltf.scene.position.set(0, 0, 0);
                    this.scene.add( gltf.scene );
                } 
            );
        } );
        
        // #endregion
    }
    
    // Initialise components
    _init() {
        this._initScene();
        this._initRenderer();
        this._initCamera();
        this._initControls();
        this._initManager();
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
        this.camera.position.y = 8;
    }

    // Controls
    _initControls() {
        this.controls = new ClickDragControls( this.camera, this.renderer.domElement );
    }

    _initManager() {

        this.loadingManager = new THREE.LoadingManager();
        
        const preloadOverlay = new Overlay( 
            "section.preloader-overlay",
            {
                open: null,
                close: "hide"
            }, false
        );
        const progress = document.getElementById( "progress" );
        
        this.loadingManager.onLoad = function ( ) {
            preloadOverlay.hide();
        }

        this.loadingManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
            progress.textContent = itemsLoaded + " of " + itemsTotal + " resources";
            // console.log( Math.ceil(itemsLoaded / itemsTotal), 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
        }

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