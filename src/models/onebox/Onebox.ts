import { HTMLElement } from 'node-html-parser';
import { computed, observable } from 'mobx';

export default abstract class Onebox {
    public readonly rawContent: string;

    public readonly html: HTMLElement;

    @observable public output: string | null = null;

    @computed
    get isReady() {
        return !!this.output;
    }

    constructor(html: HTMLElement) {
        this.rawContent = html.toString();
        this.html = html;
        this.parse();
    }

    abstract parse(): void;
}
