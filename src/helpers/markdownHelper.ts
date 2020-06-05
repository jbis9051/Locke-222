import { HTMLElement, Node, parse, TextNode } from 'node-html-parser';
import decode from 'decode-html';

export function htmlToClassicMarkdown(html: string) {
    const document = parse(html, { pre: true });

    function parseNode(node: Node): string {
        if (node instanceof TextNode) {
            return node.text;
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
                default: {
                    throw 'Parse error';
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
