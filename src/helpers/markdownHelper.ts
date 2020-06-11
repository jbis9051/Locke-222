import { HTMLElement, Node, parse, TextNode } from 'node-html-parser';
import he from 'he';

const decode = (text: string) => {
    return he.decode(text).replace(/&#39;/g, "'");
};

export function htmlToClassicMarkdown(html: string) {
    const document = parse(html, { pre: true });

    function parseNode(node: Node): string {
        if (node instanceof TextNode) {
            return decode(node.text);
        }
        if (node instanceof HTMLElement) {
            switch (node.tagName) {
                case 'a': {
                    const link = node.getAttribute('href');
                    return `[${parseNodeRoot(node)}](${link}}`;
                }
                case 'b': {
                    return `**${parseNodeRoot(node)}**`;
                }
                case 'code': {
                    return `\`${decode(node.innerHTML)}\``;
                }
                case 'i': {
                    return `*${parseNodeRoot(node)}*`;
                }
                case 'strike': {
                    return `~~${parseNodeRoot(node)}~~`;
                }
                case 'div': {
                    return decode(node.innerHTML.replace(/<br>/g, '\n')); // does this count? :D
                }
                case 'pre': {
                    return '```\n' + decode(node.rawText.replace(/\r\n/g, '\n')) + '\n```';
                }
                case 'span': {
                    if (node.classNames.includes('ob-post-tag')) {
                        return `<kbd>${parseNodeRoot(node)}</kbd>`;
                    }
                    debugger;
                    return '//TODO'; // TODO
                }
                default: {
                    throw `Parse error: Unknown tag: ${node.tagName}`;
                }
            }
        }
        throw 'Parse error';
    }

    function parseNodeRoot(root: Node): string {
        return root.childNodes.reduce((accumulator: string, currentValue) => {
            return accumulator + parseNode(currentValue);
        }, '');
    }

    return parseNodeRoot(document);
}

export function soMarkdownToClassicMarkdown() {
    // TODO
}

export function classicMarkdownToSOMarkdown() {
    // TODO
}

export function parseMarkdown(markdown: string) {
    // TODO
    return markdown;
}
