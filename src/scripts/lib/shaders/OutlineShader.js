import { Vector2 } from "three";

const OutlineShader = {
    uniforms: {
        'tDiffuse': { value: null },
		'resolution': { value: new Vector2( 1 / 1024, 1 / 512 ) }
    },

    vertexShader: `
        void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }    
    `,

    fragmentShader: `
        void main() {
            gl_FragColor = vec4(1, 0, 0, 1);
        }
    `,
}

export { OutlineShader }