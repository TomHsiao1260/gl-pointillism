export default class Texture {
    constructor(_option) {
        this.time = _option.time;
        this.gl = _option.gl;
        this.program = _option.program;
        this.resources = _option.resources;

        this.gl.useProgram(this.program);

        this.setParameters();
        this.setAttributes();
        this.setUniforms();
    }

    setParameters() {
        this.images = [];
        this.images.push(this.resources.spot);
        this.images.push(this.resources.paint);

        this.points = [];
        this.points.push(0.0, 0.0);
        this.points.push(1.0, 0.0);
        this.points.push(0.0, 1.0);
        this.points.push(0.0, 1.0);
        this.points.push(1.0, 0.0);
        this.points.push(1.0, 1.0);

        this.textures = [];
    }

    setAttributes() {
        this.texCoordLocation = this.gl.getAttribLocation(this.program, 'a_texCoord');
        this.texCoordBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.points), this.gl.STATIC_DRAW);

        this.gl.enableVertexAttribArray(this.texCoordLocation);
        this.gl.vertexAttribPointer(this.texCoordLocation, 2, this.gl.FLOAT, false, 0, 0);

        this.images.forEach((image) => {
            const texture = this.gl.createTexture();
            this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);

            this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_COLOR);
            this.gl.enable(this.gl.BLEND);

            this.textures.push(texture);
        });
    }

    setUniforms() {
        this.image0Loc = this.gl.getUniformLocation(this.program, 'u_image0');
        this.image1Loc = this.gl.getUniformLocation(this.program, 'u_image1');

        this.gl.uniform1i(this.image0Loc, 0);
        this.gl.uniform1i(this.image1Loc, 1);

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[0]);
        this.gl.activeTexture(this.gl.TEXTURE1);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[1]);
    }
}
