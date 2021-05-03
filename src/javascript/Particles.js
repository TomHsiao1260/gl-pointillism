export default class Particles {
    constructor(_option) {
        this.time = _option.time;
        this.gl = _option.gl;
        this.program = _option.program;
        this.resources = _option.resources;

        this.setDistribution();
        this.setAttributes();
        this.setUniforms();
    }

    setDistribution() {
        this.positions = [];
        this.counts = 90000;
        this.noise = 1.0;
        this.range = 800;

        const sqrtN = Math.sqrt(this.counts);

        for (let i = 0; i < sqrtN; i++) {
            for (let j = 0; j < sqrtN; j++) {
                const noiseX = this.noise * (Math.random() - 0.5);
                const noiseY = this.noise * (Math.random() - 0.5);
                const shiftX = this.range * ((i + noiseX) / sqrtN - 0.5);
                const shiftY = this.range * ((j + noiseY) / sqrtN - 0.5);
                const posX = this.gl.canvas.clientWidth / 2 + shiftX;
                const posY = this.gl.canvas.clientHeight / 2 + shiftY;
                this.positions.push(posX, posY);
            }
        }
    }

    setUniforms() {
        this.resolutionLoc = this.gl.getUniformLocation(this.program, 'u_resolution');
    }

    setAttributes() {
        this.positionLoc = this.gl.getAttribLocation(this.program, 'a_position');

        this.positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.positions), this.gl.STATIC_DRAW);
    }

    render() {
        this.gl.useProgram(this.program);

        this.renderAttributes();
        this.renderUniforms();

        this.gl.drawArrays(this.gl.POINTS, 0, this.counts);
    }

    renderUniforms() {
        this.gl.uniform2f(this.resolutionLoc, this.gl.canvas.width, this.gl.canvas.height);
    }

    renderAttributes() {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.enableVertexAttribArray(this.positionLoc);
        this.gl.vertexAttribPointer(this.positionLoc, 2, this.gl.FLOAT, false, 0, 0);
    }
}
