export class Namespace {
    constructor( callback = ()=>{} ) {
        try {
            if ( callback == undefined ) throw new Error( "Parameter 'callback' is not defined" );
            if ( typeof callback !== 'function' ) throw new TypeError( "Parameter 'callback' must be a function" );
        } catch (error) {
            console.error(error);
        }
    }

    run() {
        try {
            this.callback();
        } catch ( error ) {
            console.error( error );
        }
    }
}