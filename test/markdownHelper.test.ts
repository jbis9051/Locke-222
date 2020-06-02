import * as markdownHelper from '../src/helpers/markdownHelper';
import assert from 'assert';

describe('markdownHelper tests', () => {
    it('should parse bold text', () => {
        assert.strictEqual(markdownHelper.htmlToClassicMarkdown('<b>foo</b>'), '**foo**')
    });
    it('should parse italics text', () => {
        assert.strictEqual(markdownHelper.htmlToClassicMarkdown('<i>foo</i>'), '*foo*')
    });
    it('should parse strike through', () => {
        assert.strictEqual(markdownHelper.htmlToClassicMarkdown('<strike>foo</strike>'), '~~foo~~')
    });
    it('should parse bold and italics', () => {
        assert.strictEqual(markdownHelper.htmlToClassicMarkdown('<b><i>foo</i></b>'), '***foo***')
    });
    it('should parse strike through and italics', () => {
        assert.strictEqual(markdownHelper.htmlToClassicMarkdown('<strike><i>foo</i></strike>'), '~~*foo*~~')
    });
    it('should parse block statement', () => {
        assert.strictEqual(markdownHelper.htmlToClassicMarkdown(`<div class="full">foo <br> bar</div>`), 'foo \n bar')
    });
    it('should parse code statement', () => {
        assert.strictEqual(markdownHelper.htmlToClassicMarkdown(`<pre class="full">foo bar</pre>`), '```\nfoo bar\n```')
    });
})
