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

        const instructionOverlay = new Overlay( 
            "section.instruction-overlay",
            {
                open: null,
                close: "hide"
            }, false
        );
        
        const closeInstruction = document.getElementById( "contd" );
        closeInstruction.addEventListener( 'click', event => {
            instructionOverlay.hide( container => {
                container.style.display = "none";
            } );
        } );

        const preloadOverlay = new Overlay( 
            "section.preloader-overlay",
            {
                open: null,
                close: "hide"
            }, false
        );

        // #endregion

        const progress = document.getElementById( "progress" );
        // Instantiate the ThreeJs when the document is loaded
        const demo = new MuseumDemo;

        // #region Events

        demo.container.addEventListener( 'custom:fileloaded', event => {
            progress.textContent = event.detail.totalLoaded + " of " + event.detail.totalItems + " resources";
        } );
        
        demo.container.addEventListener( 'custom:allfilesloaded', event => {
            preloadOverlay.hide();
        } );

        demo.container.addEventListener( 'custom:LeftClickDown', event => {
            // demo.onLeftClick();
        } );
        
        demo.container.addEventListener( 'custom:LeftClickUp', event => {
            demo.onLeftClick();
        } );
        
        demo.container.addEventListener( 'custom:RightClickDown', event => {
            demo.onRightClick();
        } );

        // #endregion
    } catch (e) {
        console.error( e );
    }
} );