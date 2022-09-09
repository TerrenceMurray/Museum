import { InvokeEvent } from "../abstracts/custom";

export class InputController {

    constructor( target ) {
        this.target = target || document;

        this.pointer = { x: 0, y: 0 }
        this.click = { 
            left: false,
            middle: false,
            right: false,
        }

        this._init();

    }

    _init() {
        this.target.addEventListener( 'mousemove', event => this.#onMouseMove( event ), false );
        this.target.addEventListener( 'mousedown', event => this.#onMouseDown( event ), false );
        this.target.addEventListener( 'mouseup', event => this.#onMouseUp( event ), false );
    }

    #onMouseMove( event ) {
        this.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }

    #onMouseDown( event ) {
        switch ( event.button ) {
            case 0:
                this.click.left = true;
                InvokeEvent( "custom:LeftClickDown", this.target );
                break;
            case 1:
                this.click.middle = true;
                InvokeEvent( "custom:MiddleClickDown", this.target );
                break;
            case 2:
                this.click.right = true;
                InvokeEvent( "custom:RightClickDown", this.target );
                break;
        }
    }
    
    #onMouseUp( event ) {
        switch ( event.button ) {
            case 0:
                this.click.left = false;
                InvokeEvent( "custom:LeftClickUp", this.target );
                break;
            case 1:
                this.click.middle = false;
                InvokeEvent( "custom:MiddleClickUp", this.target );
                break;
            case 2:
                this.click.right = false;
                InvokeEvent( "custom:RightClickUp", this.target );
                break;
        }
    }

    // Callbacks
    setMouseButton( button = "", callback = function(){}, options = { once: true } ) {
        if ( callback === null || callback === undefined ) {
            console.error( "Uncaught reference: Parameter 'callback' is undefined\n\tat 'setMouseButton'" );
            return;
        }
        
        if ( ['left', 'right', 'middle'].includes( button, 0 ) === false ) {
            console.error( "Uncaught type: Parameter 'button' is not defined\n\tat 'setMouseButton'" );
            return;
        } 

        this.target.addEventListener( 'mousedown', event => { if ( this.click[button] === true ) callback( event ); }, { once: options.once } );
    }
}