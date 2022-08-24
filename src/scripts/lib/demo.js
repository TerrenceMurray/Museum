"use strict";

// Custom
import { getStringFromURL, InvokeEvent } from "./abstracts/custom";

// Base
import * as THREE from "three";

// Loaders
import { GLTFLoader } from "three/examples/jsm/loaders/gltfloader";
import { HDRILoader } from "./loaders/HDRILoader";

// Controls
import { ClickDragControls } from "./controls/ClickDragControls";

// ThreeJs Scene
export class MuseumDemo {

    constructor( container ) {
        this.container = container || document.body;

        this._init();
        this._animate();
    }

    _loadObjects() {
        //Create a DirectionalLight and turn on shadows for the light
        const light = new THREE.DirectionalLight( 0xffffff, 0.8 );
        light.position.set( 0, 10, 0 ); //default; light shining from top
        light.castShadow = true; // default false
        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;
        light.shadow.camera.near = 0.01;
        light.shadow.camera.far = 1000;
        light.shadow.radius = 10;
        this.scene.add( light );
        
        // #region HDRI

        // Create HDRI
        const hdri_loader = new HDRILoader( { 
            scene: this.scene, 
            url: new URL( "../../textures/sunset_in_the_chalk_quarry_1k.hdr", import.meta.url ),
            manager: this.loadingManager
        } );

        hdri_loader.set( { renderer: this.renderer, exposure: 1.5 } );

        hdri_loader.load( () => {

            new GLTFLoader( this.loadingManager ).load( 
                getStringFromURL( new URL( "../../objects/environment.gltf", import.meta.url ) ), 
                gltf => {
                    gltf.scene.traverse( node => {
                        if ( node.isMesh ) { node.receiveShadow = true; node.geometry.computeVertexNormals(); }
                    } );
                    gltf.scene.scale.set(5, 5, 5);
                    gltf.scene.position.set(0, 0, 0);
                    this.scene.add( gltf.scene );
                } 
            );

            new GLTFLoader( this.loadingManager ).load( 
                getStringFromURL( new URL( "../../objects/monkey.gltf", import.meta.url ) ),
                gltf => {

                    gltf.scene.traverse( node => {
                        if ( node.isMesh ) { node.castShadow = true; }
                    } );
                    
                    gltf.scene.scale.set(2, 2, 2);
                    gltf.scene.position.set(5, 2, 0);
                    this.scene.add( gltf.scene );
                }
            );
            
            new GLTFLoader( this.loadingManager ).load( 
                getStringFromURL( new URL( "../../objects/monkey-mike.gltf", import.meta.url ) ),
                gltf => {

                    gltf.scene.traverse( node => {
                        if ( node.isMesh ) { node.castShadow = true; }
                    } );
                    
                    gltf.scene.scale.set(2, 2, 2);
                    gltf.scene.position.set(-5, 2, 0);
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
        this._postProcessing();

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
        this.renderer.shadowMap.enabled = true;
        // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

        this.container.appendChild( this.renderer.domElement );
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

    // Manager
    _initManager() {
        this.loadingManager = new THREE.LoadingManager();
        const container = this.container;

        this.loadingManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
            InvokeEvent( "custom:fileloaded", 
                container, 
                { 
                    totalLoaded: itemsLoaded, 
                    totalItems: itemsTotal 
                } 
            );
        }

        this.loadingManager.onLoad = function ( ) {
            InvokeEvent( "custom:allfilesloaded", container );
        }
    }

    // Handle resizing
    _handleResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize( window.innerWidth, window.innerHeight );
        
        this._render();
    }

    // Post Processing
    _postProcessing() {

    }

    _animate() {
        requestAnimationFrame(this._animate.bind( this ));

        this._render();
    }

    _render() {
        this.renderer.render( this.scene, this.camera );
    }
}