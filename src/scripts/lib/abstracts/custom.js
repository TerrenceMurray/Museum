// #region Overlay

class Overlay {
    constructor( containerSelector, options = { open: "", close: "" } ) {
        this.container = document.querySelector( containerSelector );
        this.options = options;

        this.isHidden = true;
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
        if ( callback !== undefined && callback !== null ) callback();        
    }

    hide( callback ) {
        if ( this.isHidden === true ) return;
        
        this.container.classList.remove( this.options.open );
        this.container.classList.add( this.options.close );
        
        this.container.addEventListener('animationend', event => {
            this.container.style.display = "none";
        }, { once: true });

        this.isHidden = true;
        if ( callback !== undefined && callback !== null ) callback();
    }
}

// #endregion

// #region Functions

function getStringFromURL (url) { 
    return ".".concat(url.pathname); 
}

// #endregion

export { getStringFromURL, Overlay }