import EventEmitter from '../utils/EventEmitter';

import spot from '../assets/spot.png';
import paint from '../assets/paint.jpg';

export default class Resources extends EventEmitter {
    constructor() {
        super();

        this.load();
    }

    async load() {
        this.spot = await new Promise((resolve) => {
            const image = new Image();
            image.src = spot;
            image.onload = () => resolve(image);
        });

        this.paint = await new Promise((resolve) => {
            const image = new Image();
            image.src = paint;
            image.onload = () => resolve(image);
        });

        this.trigger('ready');
    }
}
