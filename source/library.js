"use strict";
var type_1 = require("./type");
var Library = (function () {
    function Library() {
        var guid = new type_1.Primitive('guid');
        this.types = {
            long: new type_1.Primitive('long'),
            bool: new type_1.Primitive('bool'),
            date: new type_1.Primitive('date'),
            float: new type_1.Primitive('float'),
            guid: guid,
            uuid: guid,
            json: new type_1.Primitive('json'),
            int: new type_1.Primitive('int'),
            string: new type_1.Primitive('string'),
        };
    }
    Library.prototype.add_type = function (type) {
        if (this.types[type.name])
            throw new Error('Library already has a type named ' + type.name + '.');
        this.types[type.name] = type;
    };
    return Library;
}());
exports.Library = Library;
//# sourceMappingURL=library.js.map