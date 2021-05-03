import Time from '../utils/Time';
import Utils from '../utils/Utils';
import Particles from './Particles';
import Texture from './Texture';
import Resources from './Resources';

import vertexSource from '../shaders/vertex.glsl';
import fragmentSource from '../shaders/fragment.glsl';

export default class Application {
    constructor(_option) {
        this.$canvas = _option.$canvas;

        this.gl = this.$canvas.getContext('webgl');
        this.ext = this.gl.getExtension('ANGLE_instanced_arrays');
        if (!this.gl || !this.ext) return;

        this.time = new Time();
        this.utils = new Utils({ gl: this.gl });
        this.resources = new Resources();

        this.resources.on('ready', () => {
            this.setup();
            this.render();
        });
    }

    setup() {
        this.vertex = this.utils.createShader(this.gl.VERTEX_SHADER, vertexSource);
        this.fragment = this.utils.createShader(this.gl.FRAGMENT_SHADER, fragmentSource);
        this.program = this.utils.createProgram(this.vertex, this.fragment);

        this.texture = new Texture({
            time: this.time,
            gl: this.gl,
            program: this.program,
            resources: this.resources,
        });

        this.particles = new Particles({
            ext: this.ext,
            time: this.time,
            gl: this.gl,
            program: this.program,
            resources: this.resources,
        });
    }

    render() {
        this.time.on('tick', () => {
            this.utils.resizeCanvas();
            this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
            this.gl.clearColor(0, 0, 0, 0);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);

            this.particles.render();
        });
    }
}
