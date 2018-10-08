"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
class LibraryImplementation {
    constructor() {
        this.types = {
            Long: new types_1.Primitive('Long'),
            BigNumber: new types_1.Primitive('BigNumber'),
            Bool: new types_1.Primitive('Bool'),
            Date: new types_1.Primitive('Date'),
            Datetime: new types_1.Primitive('Datetime'),
            Float: new types_1.Primitive('Float'),
            Int: new types_1.Primitive('Int'),
            Json: new types_1.Primitive('Json'),
            Jsonb: new types_1.Primitive('Jsonb'),
            Short: new types_1.Primitive('Short'),
            String: new types_1.Primitive('String'),
            Time: new types_1.Primitive('Time'),
            Text: new types_1.Primitive('Text'),
            Uuid: new types_1.Primitive('Uuid'),
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