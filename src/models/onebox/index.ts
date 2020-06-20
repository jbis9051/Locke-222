import { HTMLElement, parse } from 'node-html-parser';
import Onebox from './Onebox';
import OBImage from './OBImage';
import OBxkcd from './OBxkcd';
import OBBlog from './OBBlog';

export default function getOneBox(htmlString: string): Onebox | string {
    const doc = parse(htmlString, { pre: true });
    const node = doc.childNodes[0];
    if (!(node instanceof HTMLElement)) {
        throw new Error('Node is not an HTML element');
    }
    if (node.classNames.includes('ob-image')) {
        return new OBImage(node);
    }
    if (node.classNames.includes('ob-xkcd')) {
        return new OBxkcd(node);
    }
    if (node.classNames.includes('ob-blog')) {
        return new OBBlog(node);
    }
    return '// TODO IMPLEMENT ONEBOX';
}
