"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var type_1 = require("./type");
var Library = (function () {
    function Library() {
        var guid = new type_1.Primitive('guid');
        this.types = {
            long: new type_1.Primitive('long'),
            bool: new type_1.Primitive('bool'),
            colossal: new type_1.Primitive('colossal'),
            date: new type_1.Primitive('date'),
            datetime: new type_1.Primitive('datetime'),
            float: new type_1.Primitive('float'),
            guid: guid,
            int: new type_1.Primitive('int'),
            json: new type_1.Primitive('json'),
            string: new type_1.Primitive('string'),
            time: new type_1.Primitive('time'),
            text: new type_1.Primitive('text'),
            uuid: guid,
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