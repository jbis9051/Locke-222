import Onebox from './Onebox';

export default class OBBlog extends Onebox {
    parse(): void {
        const anchor = (this.html.querySelector(
            '.ob-blog-title a'
        )! as unknown) as HTMLAnchorElement;
        const title = anchor.text;
        const titleHref = anchor.href;
        const meta = ((this.html.querySelector('.ob-blog-meta')! as unknown) as HTMLAnchorElement)
            .text;

        const text = ((this.html.querySelector('.ob-blog-text')! as unknown) as HTMLAnchorElement)
            .text;

        this.output = `
<div class="onebox og-blog"> 
<div class="ob-blog-title">
    <a href="${titleHref}" rel="nofollow nopener noreferrer">${title}</a>
</div>
<div class="ob-blog-meta">${meta}</div>
<div class="ob-blog-text">
    <p>${text}</p>
</div>
</div>

        `;
    }
}
