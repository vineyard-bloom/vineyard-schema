"use strict";
var trellis_1 = require("./trellis");
var Library = (function () {
    function Library() {
        var guid = new trellis_1.Primitive('guid');
        this.types = {
            bool: new trellis_1.Primitive('bool'),
            date: new trellis_1.Primitive('date'),
            float: new trellis_1.Primitive('float'),
            guid: guid,
            uuid: guid,
            json: new trellis_1.Primitive('json'),
            int: new trellis_1.Primitive('int'),
            string: new trellis_1.Primitive('string'),
        };
    }
    return Library;
}());
exports.Library = Library;
//# sourceMappingURL=library.js.map