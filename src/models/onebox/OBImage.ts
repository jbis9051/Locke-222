import React from 'react';
import { Onebox } from './Onebox';

export default class OBImage extends Onebox {
    parse() {
        const src = ((this.html.querySelector('img')! as unknown) as HTMLImageElement).getAttribute(
            'src'
        )!;
        this.output = `
            <img class="onebox ob-image" src=${src}>
        `;
    }
}
