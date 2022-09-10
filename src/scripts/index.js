"use strict";

import { Overlay } from "./lib/abstracts/custom";
import { MuseumDemo } from "./lib/demo";

window.addEventListener( 'DOMContentLoaded' ,() => {
    try {
        // #region Overlays

        const mouseOverlay = new Overlay(
            "section.mouse-overlay",
            {
                open: "show",
                close: "hide"
            }, false
        );

        const aboutOverlay = new Overlay( 
            "section.about-overlay",
            {
                open: "expand",
                close: "collapse"
            }, false
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
                close: "hide",
                display: "flex"
            }, true
        );
        
        const closeInstruction = document.getElementById( "contd" );
        closeInstruction.addEventListener( 'click', event => {
            instructionOverlay.hide( container => {
                container.style.display = "none";
                mouseOverlay.show();
            } );
        } );

        const preloadOverlay = new Overlay( 
            "section.preloader-overlay",
            {
                open: null,
                close: "hide",
                display: "flex"
            }, true
        );

        const objectOverlay = new Overlay(
            "section.object-overlay",
            {
                open: "show",
                close: "hide"
            }, false
        );

        // #endregion

        const Formats = {
            object: ( data = { name, author, desc } ) => `
            <p class="name">${ data.name }</p>
            <p class="author">Created By ${ data.author }</p>
            <p class="desc">${ data.desc }</p>
            `,
        }

        const ObjectData = new Map();
        ObjectData.set( "Mike", { 
            name: "Mike",
            author: "Terrence Murray",
            desc: "This monkey was created in blender to be used as a test model for the Museum project"
        } );
        ObjectData.set( "Suzanne", { 
            name: "Suzanne",
            author: "Terrence Murray",
            desc: "This monkey was created in blender to be used as a test model for the Museum project"
        } );

        const progress = document.getElementById( "progress" );
        // Instantiate the ThreeJs when the document is loaded
        const demo = new MuseumDemo;

        // #region Events

        demo.container.addEventListener( 'custom:fileloaded', event => {
            progress.textContent = event.detail.totalLoaded + " of " + event.detail.totalItems + " resources";
        } );
        
        demo.container.addEventListener( 'custom:allfilesloaded', event => preloadOverlay.hide() );
        demo.container.addEventListener( 'custom:LeftClickUp', event => demo.onSelectObject() );
        demo.container.addEventListener( 'custom:RightClickDown', event => demo.onMovePosition() );
        
        demo.container.addEventListener( 'custom:selectobject', event => {
            objectOverlay.container.innerHTML = Formats.object( ObjectData.get( event.detail.name ) );
            objectOverlay.show();
        } );
        demo.container.addEventListener( 'custom:deselectobject', event => objectOverlay.hide() );
        

        // #endregion
    } catch (e) {
        console.error( e );
    }
} );