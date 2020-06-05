export default function abbreviateString(string: string): string {
    if(string.trim().length <= 2){
        return string.trim();
    }
    const words = string.split(/\s/);
    if (words.length > 1) {
        const wordsWithCapFirstLetter = words.filter(word => word[0] === word[0].toUpperCase());
        if (wordsWithCapFirstLetter.length === 0) {
            return words
                .slice(0, 2)
                .map(word => word[0])
                .join('');
        }
        return wordsWithCapFirstLetter
            .slice(0, 2)
            .map(word => word[0])
            .join('');
    }
    const caps = Array.from(string.match(/[A-Z]/g) || []);
    if (caps.length > 0) {
        return caps.slice(0, 2).join('');
    }
    return string.substring(0, 2);
}
