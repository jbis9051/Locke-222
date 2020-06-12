import { Onebox } from './Onebox';
import { HTMLElement, Node, parse, TextNode } from 'node-html-parser';
import OBImage from './OBImage';

export default async function getOneBox(htmlString: string): Promise<Onebox | string> {
    const doc = parse(htmlString, { pre: true });
    const node = doc.childNodes[0];
    if (!(node instanceof HTMLElement)) {
        throw 'Node is not an HTML element';
    }
    if (node.classNames.includes('ob-image')) {
        return await OBImage.create(node);
    }
    return '// TODO IMPLEMENT ONEBOX';
}
