import React from 'react';
import { HTMLElement } from 'node-html-parser';

export abstract class Onebox {
    get jsx(): React.ReactElement {
        return <React.ReactElement<any, string | React.JSXElementConstructor<any>>>this._jsx;
    }

    protected _jsx?: React.ReactElement;
    private rawContent: string;

    protected constructor(rawContent: HTMLElement) {
        this.rawContent = rawContent.toString();
    }

    // abstract static async create(html: HTMLElement): Promise<Onebox>;
    abstract async parse(html: HTMLElement): Promise<void>;
}
