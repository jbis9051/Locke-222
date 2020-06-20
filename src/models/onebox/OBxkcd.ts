import Onebox from './Onebox';

export default class OBxkcd extends Onebox {
    parse(): void {
        const img = (this.html.querySelector('img')! as unknown) as HTMLImageElement;
        const src = img.getAttribute('src')!;
        const { title } = img;
        const { href } = (this.html.querySelector('a')! as unknown) as HTMLAnchorElement;

        this.output = `
            <a href="${href}" rel="nofollow nopener noreferrer">
                <img class="onebox ob-image" src=${src} title=${title}>  
            </a>
        `;
    }
}
