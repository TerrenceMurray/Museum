import { 
    ACESFilmicToneMapping, 
    EquirectangularReflectionMapping, 
    LoadingManager, 
    sRGBEncoding 
} from "three";

import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

/** Loads an HDR (*.hdr) image into your scene
 *  @param [scene] Three.js scene
 *  @param [url] the directory of your *.hdr file
 *  @param [isBackground=false] use the hdr as your scene background
 *  @param [isEnvronment=true] use the hdr as your reflections in your scene
 */

export class HDRILoader {
    constructor ( parameters = { scene: Scene,  url: URL, isBackground: false, isEnvironment: true, manager: LoadingManager } ) {
        this.url = parameters.url;
        this.scene = parameters.scene;
        this.loader = new RGBELoader( parameters.manager );
        this.isBackground = parameters.isBackground ?? false;
        this.isEnvironment = parameters.isEnvironment ?? true;
    }
    
    set({ renderer, exposure = 1 }) {
        if (renderer == null) console.error(`Undefined parameter: "renderer" was not passed`);
        renderer.toneMapping = ACESFilmicToneMapping;
        renderer.toneMappingExposure = exposure;
        renderer.outputEncoding = sRGBEncoding;
    }

    load(loadObjectsCallback = null) {
        this.loader.load( this.url, texture => {
            
            texture.mapping = EquirectangularReflectionMapping;
            
            if (this.isEnvironment) this.scene.environment = texture;
            if (this.isBackground) this.scene.background = texture;
            
            if (loadObjectsCallback == null) return;

            loadObjectsCallback();
        } );
    }
}