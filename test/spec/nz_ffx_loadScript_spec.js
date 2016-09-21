describe("nz_ffx_loadScript.js", function() {
    'use strict';

    beforeEach(function () {
    })

    it("should be available", function() {
        expect(typeof(nz.ffx.loadScript)).toBe('function');
    });

    it("should be able to load another script", function(done) {
        var testLoadingUrl = 'base/test/fixture/testLoading.js';
        var testLoadingPromise = nz.ffx.loadScript(testLoadingUrl);

        testLoadingPromise
            .then(function(url) {
                expect(url).toBe(testLoadingUrl);
                expect(window.nz.ffx.testLoading).toBe('testLoading loaded');
                done()
            })
            .catch(function(error) {
                console.log(error);
                // Force a failure
                expect(error).toBe(null);
                done()
            })
    });

    it("should be only load a given script once", function(done) {
        var testLoadingUrl = 'base/test/fixture/testLoading.js';
        var testLoadingUrlPromise1 = nz.ffx.loadScript(testLoadingUrl);
        var testLoadingUrlPromise2 = nz.ffx.loadScript(testLoadingUrl);

        var testAsyncShortLoadUrl = 'base/test/fixture/testAsyncShortLoad.js';
        var testAsyncShortLoadPromise = nz.ffx.loadScript(testAsyncShortLoadUrl);

        window.Promise.all([
            testLoadingUrlPromise1,
            testLoadingUrlPromise2,
            testAsyncShortLoadPromise
        ]).then(function() {
            // Prove that loading the same script twice produces the same object
            expect(window.nz.ffx.testLoading).toBe('testLoading loaded');
            expect(testLoadingUrlPromise1).toBe(testLoadingUrlPromise2);

            // Prove that loading two different scripts produces two different objects
            expect(window.nz.ffx.testAsyncShortLoad).toBe('testAsyncShortLoad loaded');
            expect(testLoadingUrlPromise1).not.toBe(testAsyncShortLoadPromise);
            done()
        })
        .catch(function(error) {
            console.log(error);
            // Force a failure
            expect(error).toBe(null);
            done()
        })
    });

    afterEach(function () {
    })

});
