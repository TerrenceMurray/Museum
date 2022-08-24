// #region Overlay

class Overlay {
    constructor( containerSelector, options = { open: "", close: "" }, initial = true ) {
        this.container = document.querySelector( containerSelector );
        this.options = options;

        this.isHidden = initial;
        this._init();
    }

    _init() {
        if ( this.isHidden === false ) this.show();
        else if ( this.isHidden === true ) this.hide();
    }

    show( callback ) {
        if ( this.isHidden === false ) return;

        this.container.classList.remove( this.options.close );
        this.container.classList.add( this.options.open );
        this.container.style.display = "block";
        
        this.isHidden = false;    
        if ( callback !== undefined && callback !== null ) callback( this.container );        
    }

    hide( callback ) {
        if ( this.isHidden === true ) return;
        
        if ( this.options.open !== null && this.options.open !== undefined ) this.container.classList.remove( this.options.open );
        this.container.classList.add( this.options.close );
        
        this.container.addEventListener('animationend', event => {
            this.container.style.display = "none";
        }, { once: true });

        this.isHidden = true;
        if ( callback !== undefined && callback !== null ) callback( this.container );
    }
}

// #endregion

// #region Functions

function getStringFromURL (url) { 
    return ".".concat(url.pathname); 
}

function InvokeEvent( event = "", elem, data = {} ) {
    const evnt = new CustomEvent( event, {
        detail: data
    } );

    elem.dispatchEvent( evnt );
}

// #endregion

export { getStringFromURL, Overlay, InvokeEvent }