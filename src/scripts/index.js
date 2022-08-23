"use strict";

import { Overlay } from "./lib/abstracts/custom";
import { MuseumDemo } from "./lib/demo";



window.addEventListener( 'DOMContentLoaded' ,() => {
    try {
        // #region Overlays

        const aboutOverlay = new Overlay( 
            "section.about-overlay",
            {
                open: "expand",
                close: "collapse"
            }
        );
        
        const openAbout = document.getElementById( "open-about" );
        openAbout.addEventListener( 'click', event => {
            aboutOverlay.show();
        } );
        
        const closeAbout = document.getElementById( "close-about" );
        closeAbout.addEventListener( 'click', event => {
            aboutOverlay.hide();
        } );

        // #endregion
        
        // Instantiate the ThreeJs when the document is loaded
        const demo = new MuseumDemo;

    } catch (e) {
        console.error( e );
    }
    
} );