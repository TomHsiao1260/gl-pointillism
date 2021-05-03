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
        this.numInstances = 80000;

        for (let i = 0; i < this.numInstances; i++) {
            const positionX = 800 * (Math.random() - 0.5);
            const positionY = 800 * (Math.random() - 0.5);
            const x = this.gl.canvas.clientWidth / 2 + positionX;
            const y = this.gl.canvas.clientHeight / 2 + positionY;
            this.positions.push(x, y);
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

        this.gl.drawArrays(this.gl.POINTS, 0, this.numInstances);
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
