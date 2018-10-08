"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
class LibraryImplementation {
    constructor() {
        const guid = new types_1.Primitive('guid');
        this.types = {
            long: new types_1.Primitive('long'),
            bignumber: new types_1.Primitive('bignumber'),
            bool: new types_1.Primitive('bool'),
            char: new types_1.Primitive('char'),
            colossal: new types_1.Primitive('colossal'),
            date: new types_1.Primitive('date'),
            datetime: new types_1.Primitive('datetime'),
            float: new types_1.Primitive('float'),
            guid: guid,
            int: new types_1.Primitive('int'),
            json: new types_1.Primitive('json'),
            short: new types_1.Primitive('short'),
            string: new types_1.Primitive('string'),
            time: new types_1.Primitive('time'),
            text: new types_1.Primitive('text'),
            uuid: guid,
        };
    }
    add_type(type) {
        if (this.types[type.name])
            throw new Error('LibraryImplementation already has a type named ' + type.name + '.');
        this.types[type.name] = type;
    }
}
exports.LibraryImplementation = LibraryImplementation;
//# sourceMappingURL=library.js.map