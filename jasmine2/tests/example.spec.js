describe('example test', function () {
    it('should have the word angular on angularjs.org', function () {
        browser.get('http://angularjs.org/');
        expect(element(by.tagName('body')).getText()).toContain('angular');
    });
});