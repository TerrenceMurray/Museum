// #region Overlay Class

class Overlay {
    constructor( container, options = { classes: { open, close }, events: { onOpen, onClose } } ) {
        this.container = document.querySelector(container);
        this.options = options;

        this.isHidden = true;
        this._init();
    }

    _init() {

    }
}

// #endregion

// #region Functions

function getStringFromURL (url) { 
    return ".".concat(url.pathname); 
}

// #endregion

export { getStringFromURL, Overlay }