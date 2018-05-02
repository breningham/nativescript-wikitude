var Wikitude = require("nativescript-wikitude").Wikitude;
var wikitude = new Wikitude();

describe("greet function", function() {
    it("exists", function() {
        expect(wikitude.greet).toBeDefined();
    });

    it("returns a string", function() {
        expect(wikitude.greet()).toEqual("Hello, NS");
    });
});