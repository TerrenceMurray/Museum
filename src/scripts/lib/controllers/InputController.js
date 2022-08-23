export class InputController {

    constructor( target ) {
        this.target = target || document;

        this.pointer = {
            x: 0, 
            y: 0
        }
        this.isActive = { 
            leftClick: false,
            middleClick: false,
            rightClick: false,
        }

        this._init();

    }

    _init() {
        this.target.addEventListener( 'mousemove', event => this.onMouseMove( event ), false );
        this.target.addEventListener( 'mousedown', event => this.onMouseDown( event ), false );
        this.target.addEventListener( 'mouseup', event => this.onMouseUp( event ), false );
    }

    onMouseMove( event ) {
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = (event.clientY / window.innerWidth) * 2 + 1;
    }

    onMouseDown( event ) {
        switch ( event.button ) {
            case 0:
                this.isActive.leftClick = true;
                break;
            case 1:
                this.isActive.middleClick = true;
                break;
            case 2:
                this.isActive.rightClick = true;
                break;
        }
    }
    
    onMouseUp( event ) {
        switch ( event.button ) {
            case 0:
                this.isActive.leftClick = false;
                break;
            case 1:
                this.isActive.middleClick = false;
                break;
            case 2:
                this.isActive.rightClick = false;
                break;
        }
    }

}