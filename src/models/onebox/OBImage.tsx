import { Onebox } from './Onebox';
import React from 'react';
import { HTMLElement } from 'node-html-parser';

export default class OBImage extends Onebox {
    static async create(content: HTMLElement): Promise<OBImage> {
        const obImage = new OBImage(content);
        await obImage.parse(content);
        return obImage;
    }

    async parse(html: HTMLElement): Promise<void> {
        this._jsx = (
            <img
                src={
                    ((html.querySelector('img')! as unknown) as HTMLImageElement).getAttribute(
                        'src'
                    )!
                }
            />
        );
    }
}
