/** Allows the user to click and drag the camera
 *  @param [camera] Three.js camera
 *  @param [domElement] Three.js WEBGLRenderer DOM element
 */

export class ClickDragControls {

    #isActive = true;

    constructor( camera, domElement ) {
        this.camera = camera;
        
        this.domElement = domElement;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        
        this.start = { x: 0, y: 0 }
        this.delta = { x: 0, y: 0 }
        
        this.#_init();
    }

    get active() {
        return this.#isActive;
    }

    set active( flag ) {
        try {
            if ( typeof flag != 'boolean' ) throw new TypeError( "Incorrect datatype set as 'flag'" );
            this.#isActive = flag;
        } catch ( error ) {
            console.error( error );
        }
    }

    #_init() {
        this.domElement.addEventListener( 'mousedown', event => this.#_mouseBtnDown( event ), false );
        this.domElement.addEventListener( 'mouseup', event => this.#_mouseBtnUp( event ), false );
        this.domElement.addEventListener( 'mouseleave', event => this.#_mouseBtnUp( event ), false );
    }
    
    #_update = ( e ) => {
        this.delta.x = e.clientX - this.start.x;
        this.delta.y = e.clientY - this.start.y;
        var min = Math.min( this.width, this.height );
        
        this.camera.rotation.order = "YXZ";
        
        this.camera.rotation.x += this.delta.y / min;
        this.camera.rotation.y += this.delta.x / min;
        
        this.start.x = e.clientX;
        this.start.y = e.clientY;
    }

    #_mouseBtnDown( e ) {
        if ( this.#isActive == false ) return;
        if ( e.button == 0 ) this.domElement.style.cursor = 'grabbing';
        
        this.domElement.addEventListener( 'mousemove', this.#_update, false );
        
        this.start.x = e.clientX;
        this.start.y = e.clientY;
    }

    #_mouseBtnUp( e ) {
        if ( this.#isActive == false ) return;
        this.domElement.removeEventListener( 'mousemove', this.#_update, false );
        this.domElement.style.cursor = 'default';
    }  
}