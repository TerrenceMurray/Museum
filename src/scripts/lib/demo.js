"use strict";

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/gltfloader";
import { HDRILoader } from "./loaders/HDRILoader";
import { ClickDragControls } from "./controls/ClickDragControls";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { InputController } from "./controllers/InputController";
import { gsap } from "gsap";
import { getStringFromURL, InvokeEvent } from "./abstracts/custom";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
// import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
// import { OutlineShader } from "./shaders/OutlineShader";

// ThreeJs Scene
export class MuseumDemo {

    #objects = new Array();
    #floor = new Array();
    #selected = null;

    constructor( container ) {
        this.container = container || document.body;

        this._init();
        this._animate();
    }

    _loadObjects() {
        // #region Directional Light
        const light = new THREE.DirectionalLight( 0xffffff, 0.8 );
        light.position.set( 0, 10, 0 ); //default; light shining from top
        light.castShadow = true; // default false
        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;
        light.shadow.camera.near = 0.01;
        light.shadow.camera.far = 1000;
        light.shadow.radius = 10;
        this.scene.add( light );
        // #endregion
        
        // #region HDRI & Objects
        // Create HDRI
        const hdri_loader = new HDRILoader( { 
            scene: this.scene, 
            url: new URL( "../../textures/brown_photostudio_02_1k.hdr", import.meta.url ),
            manager: this.loadingManager
        } );

        hdri_loader.set( { renderer: this.renderer, exposure: 0.5 } );

        hdri_loader.load( () => {

            new GLTFLoader( this.loadingManager ).load( 
                getStringFromURL( new URL( "../../objects/floor.gltf", import.meta.url ) ), 
                gltf => {
                    gltf.scene.traverse( node => {
                        if ( node.isMesh ) { 
                            node.receiveShadow = true; 
                            node.geometry.computeVertexNormals(); 
                            node.scale.set(100, 100, 100);
                            node.position.set(0, 2.5, 0);
                            this.scene.add( node );
                            this.#floor.push(node);
                        }
                    } );
                } 
            );

            new GLTFLoader( this.loadingManager ).load( 
                getStringFromURL( new URL( "../../objects/monkey.gltf", import.meta.url ) ),
                gltf => {
                    gltf.scene.traverse( node => {
                        if ( node.isMesh ) { 
                            node.castShadow = true;
                            node.position.set(5, 3.5, 0);
                            node.scale.set(2, 2, 2);
                            this.scene.add( node );
                            this.#objects.push( node );
                        }
                    } );
                }
            );
            
            new GLTFLoader( this.loadingManager ).load( 
                getStringFromURL( new URL( "../../objects/monkey-mike.gltf", import.meta.url ) ),
                gltf => {
                    gltf.scene.traverse( node => {
                        if ( node.isMesh ) { 
                            node.castShadow = true;
                            node.position.set(-5, 3.5, 0);
                            node.scale.set(2, 2, 2);
                            this.scene.add( node );
                            this.#objects.push( node );
                        }
                    } );
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
        
        this.orbitcontrols = new OrbitControls( this.camera, this.renderer.domElement );
        this.orbitcontrols.enabled = false;
        
        this.orbitcontrols.minDistance = 5;
        this.orbitcontrols.maxDistance = 15;

        this.orbitcontrols.minPolarAngle = 0;
        this.orbitcontrols.maxPolarAngle = Math.PI / 2;


        this.orbitcontrols.mouseButtons = {
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: null,
            RIGHT: null,
        }

        // Input Controller
        this.raycaster = new THREE.Raycaster();
        this.inputController = new InputController( this.container );

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

    _animate() {
        requestAnimationFrame(this._animate.bind( this ));

        if ( this.orbitcontrols.enabled == true ) this.orbitcontrols.update();
        
        this._render();
    }

    _render() {
        this.raycaster.setFromCamera( this.inputController.pointer, this.camera );
        
        this.renderer.render( this.scene, this.camera );
    }

    // Events
    onSelectObject() {
        var intersects = this.raycaster.intersectObjects( this.#objects );
        var selected = intersects.length > 0 ? intersects[0] : null;
        if ( selected === null ) return;

        if ( this.controls.active == true ) this.controls.active = false;
               
        var fromDirection = new THREE.Vector3();
        this.camera.getWorldDirection( fromDirection )
        var rc = new THREE.Raycaster();
        rc.set( this.camera.position, fromDirection )
        var result = rc.intersectObjects( this.scene.children );
        if ( result.length > 0 ) {
            this.orbitcontrols.target.copy( result[0].point );
        }

        if ( this.orbitcontrols.enabled == false ) this.orbitcontrols.enabled = true;
        
        gsap.to( this.orbitcontrols.target, {
            duration: 0.5,
            x: selected.object.position.x,
            y: selected.object.position.y,
            z: selected.object.position.z,
            onComplete: () => {
                this.orbitcontrols.update();
            }
        } );

        InvokeEvent( "custom:selectobject", this.container, {
            name: selected.object.name
        } );
        this.#selected = selected.object.name;
    }

    onMovePosition() {        
        var intersects = this.raycaster.intersectObjects( this.#floor );
        var point = intersects.length > 0 ? intersects[0].point : null;
        if ( point === null ) return;
        
        if ( this.orbitcontrols.enabled == true ) {
            this.orbitcontrols.enabled = false;
            if ( this.#selected != null ) {
                InvokeEvent( "custom:deselectobject", this.container, {
                    name: this.#selected
                } );
                this.#selected = null;
            }
            this.controls.active = true;
        }
        
        gsap.to( this.camera.position, { 
            duration: 1,  
            ease: 'expo.out',
            x: point.x,  
            y: 8,
            z: point.z,  
        } );
    }
}