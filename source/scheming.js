"use strict";
var loading_1 = require("./loading");
var Schema = (function () {
    function Schema(definitions) {
        if (definitions === void 0) { definitions = undefined; }
        this.trellises = {};
        this.library = new loading_1.Library();
        if (definitions) {
            this.define(definitions);
        }
    }
    Schema.prototype.define = function (definitions) {
        var loader = new loading_1.Loader(this.library);
        for (var name_1 in definitions) {
            var definition = definitions[name_1];
            this.trellises[name_1] = loading_1.load_trellis(name_1, definition, loader);
        }
        for (var a in loader.incomplete) {
            throw Error("Unknown type '" + a + "'.");
        }
    };
    return Schema;
}());
exports.Schema = Schema;
//# sourceMappingURL=scheming.js.map