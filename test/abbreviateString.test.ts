import abbreviateString from '../src/helpers/abbreviateString';
import assert from 'assert';

describe('abbreviateString tests', () => {
    it('should abbreviate two words', () => {
        assert.strictEqual(abbreviateString("Foo Bar"), "FB");
    });
    it('should abbreviate two words with lowercase', () => {
        assert.strictEqual(abbreviateString("Foo of Bar"), "FB");
    });
    it('should abbreviate three words', () => {
        assert.strictEqual(abbreviateString("Foo Bar Foo"), "FB");
    });
    it('should abbreviate camelCase', () => {
        assert.strictEqual(abbreviateString("FooBar"), "FB");
    });
    it('should abbreviate no caps', () => {
        assert.strictEqual(abbreviateString("foobar"), "fo");
    });
    it('should abbreviate handle 2 char string', () => {
        assert.strictEqual(abbreviateString("C#"), "C#");
    });
})
