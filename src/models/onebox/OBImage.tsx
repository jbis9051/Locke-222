import React from 'react';
import { HTMLElement } from 'node-html-parser';
import { Onebox } from './Onebox';

export default class OBImage extends Onebox {
    static async create(content: HTMLElement): Promise<OBImage> {
        const obImage = new OBImage(content);
        await obImage.parse(content);
        return obImage;
    }

    parse(html: HTMLElement): Promise<void> {
        this._jsx = (
            <img
                src={
                    ((html.querySelector('img')! as unknown) as HTMLImageElement).getAttribute(
                        'src'
                    )!
                }
            />
        );
        return Promise.resolve();
    }
}
