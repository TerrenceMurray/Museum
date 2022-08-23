// #region Overlay Class

class Overlay {
    constructor( container, options = { styles: { open, close } } ) {
        this.container = document.querySelector(container);
        this.options = options;

        this.isHidden = true;
        this._init();
    }

    _init() {
        
    }

    show() {

    }

    hide() {

    }
}

// #endregion

// #region Functions

function getStringFromURL (url) { 
    return ".".concat(url.pathname); 
}

// #endregion

export { getStringFromURL, Overlay }