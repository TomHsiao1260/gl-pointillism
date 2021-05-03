export default class Particles {
    constructor(_option) {
        this.ext = _option.ext;
        this.time = _option.time;
        this.gl = _option.gl;
        this.program = _option.program;
        this.resources = _option.resources;

        this.setParameters();
        this.setDistribution();
        this.setAttributes();
        this.setUniforms();
    }

    setParameters() {
        this.rectangle = {};
        this.rectangle.positions = [];
        this.rectangle.width = 5;
        this.rectangle.height = 5;

        this.rectangle.positions.push(-this.rectangle.width / 2, -this.rectangle.height / 2);
        this.rectangle.positions.push(this.rectangle.width / 2, -this.rectangle.height / 2);
        this.rectangle.positions.push(-this.rectangle.width / 2, this.rectangle.height / 2);
        this.rectangle.positions.push(-this.rectangle.width / 2, this.rectangle.height / 2);
        this.rectangle.positions.push(this.rectangle.width / 2, -this.rectangle.height / 2);
        this.rectangle.positions.push(this.rectangle.width / 2, this.rectangle.height / 2);

        this.numVertices = this.rectangle.positions.length / 2;
    }

    setDistribution() {
        this.shifts = [];
        this.numInstances = 80000;

        for (let i = 0; i < this.numInstances; i++) {
            const shiftX = 800 * (Math.random() - 0.5);
            const shiftY = 800 * (Math.random() - 0.5);
            const x = this.gl.canvas.clientWidth / 2 + shiftX;
            const y = this.gl.canvas.clientHeight / 2 + shiftY;
            this.shifts.push(x, y);
        }
    }

    setUniforms() {
        this.resolutionLoc = this.gl.getUniformLocation(this.program, 'u_resolution');
    }

    setAttributes() {
        this.positionLoc = this.gl.getAttribLocation(this.program, 'a_position');
        this.shiftLoc = this.gl.getAttribLocation(this.program, 'a_shift');

        this.positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.rectangle.positions), this.gl.STATIC_DRAW);

        this.shiftBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.shiftBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.shifts), this.gl.STATIC_DRAW);
    }

    render() {
        this.gl.useProgram(this.program);

        this.renderAttributes();
        this.renderUniforms();

        this.ext.drawArraysInstancedANGLE(this.gl.TRIANGLES, 0, this.numVertices, this.numInstances);
    }

    renderUniforms() {
        this.gl.uniform2f(this.resolutionLoc, this.gl.canvas.width, this.gl.canvas.height);
    }

    renderAttributes() {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.enableVertexAttribArray(this.positionLoc);
        this.gl.vertexAttribPointer(this.positionLoc, 2, this.gl.FLOAT, false, 0, 0);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.shiftBuffer);
        this.gl.enableVertexAttribArray(this.shiftLoc);
        this.gl.vertexAttribPointer(this.shiftLoc, 2, this.gl.FLOAT, false, 0, 0);
        this.ext.vertexAttribDivisorANGLE(this.shiftLoc, 1);
    }
}
