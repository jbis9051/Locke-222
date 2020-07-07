import UserStore from '../stores/UserStore';

type MatcherArray = [
    RegExp,
    (
        before: string | undefined,
        match: string[],
        after: string | undefined
    ) => string | string[] | void
][];

export default function parseStringMessage(str: string): string {
    const matchers: MatcherArray = [
        [
            /https?:\/\/[^\s]+/g,
            (_, match) => {
                return `<a target="_blank" href=${match[0]}>${match[0]}</a>`;
            },
        ],
        [
            /@[^\s]+/g,
            (_, match) => {
                const users = UserStore.getByMentionString(match[0]);
                if (users[0]) {
                    return `<span class="user-mention">@${users[0].mentionString}</span>`;
                }
                return `<span>${match[0]}</span>`;
            },
        ],
    ];

    function parse(text: string, matcherArray: MatcherArray): string[] | null {
        if (text.length === 0) {
            return null;
        }
        if (matcherArray.length === 0) {
            return [`<span>${text}</span>`];
        }

        const arr: string[] = [];

        function addValue(val: string | string[] | null | void) {
            // this just allows us to return anything from an array of elements to a single element to no elements
            if (val) {
                if (Array.isArray(val)) {
                    arr.push(...val);
                } else {
                    arr.push(val);
                }
            }
        }

        const [regExp, callback] = matcherArray[0];
        const matches = Array.from(text.matchAll(regExp));
        const splits = text.split(regExp);
        splits.forEach((split: string, index: number) => {
            addValue(parse(split, matcherArray.slice(1))); // this text obv didn't match the first one so check the next one
            if (matches[index]) {
                addValue(callback(split, matches[index], splits[index + 1])); // run the callback passing the before string, match array, and the after string
            }
        });
        return arr;
    }

    const result = parse(str, matchers);
    if (result) {
        return result.join('');
    }
    return '';
}
