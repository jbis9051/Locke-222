import { HTMLElement, Node, parse, TextNode } from 'node-html-parser';
import he from 'he';
import parseStringMessage from './stringMessageHelper';

const decode = (text: string) => {
    return he.decode(text).replace(/&#39;/g, "'");
};

export function htmlToClassicMarkdown(html: string): string | null {
    const document = parse(html, { pre: true });

    function parseNodeRoot(root: Node): string {
        function parseNode(node: Node): string {
            if (node instanceof TextNode) {
                return parseStringMessage(decode(node.text));
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
                        if (node.classNames.includes('full')) {
                            return parseStringMessage(
                                decode(node.innerHTML.replace(/<br>/g, '\n'))
                            ); // does this count? :D
                        }
                        if (node.classNames.includes('onebox')) {
                            throw new Error('Embedded one boxes are not supported');
                        }
                        return '//TODO div';
                    }
                    case 'pre': {
                        return `\`\`\`\n${decode(node.rawText.replace(/\r\n/g, '\n'))}\n\`\`\``;
                    }
                    case 'span': {
                        if (node.classNames.includes('ob-post-tag')) {
                            return `<kbd>${parseNodeRoot(node)}</kbd>`;
                        }
                        return '//TODO span'; // TODO
                    }
                    default: {
                        throw new Error(`Parse error: Unknown tag: ${node.tagName}`);
                    }
                }
            }
            throw new Error('Parse error');
        }

        return root.childNodes.reduce((accumulator: string, currentValue) => {
            return accumulator + parseNode(currentValue);
        }, '');
    }

    if (
        document.childNodes[0] instanceof HTMLElement &&
        (document.childNodes[0] as HTMLElement).classNames.includes('onebox')
    ) {
        return null;
    }

    return parseNodeRoot(document);
}

export function soMarkdownToClassicMarkdown(): string {
    // TODO
    return 'stub';
}

export function classicMarkdownToSOMarkdown(): string {
    // TODO
    return 'stub';
}

export function parseMarkdown(markdown: string): string {
    // TODO
    return markdown;
}
