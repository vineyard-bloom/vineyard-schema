"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TypeCategory;
(function (TypeCategory) {
    TypeCategory[TypeCategory["incomplete"] = 0] = "incomplete";
    TypeCategory[TypeCategory["decimal"] = 1] = "decimal";
    TypeCategory[TypeCategory["primitive"] = 2] = "primitive";
    TypeCategory[TypeCategory["list"] = 3] = "list";
    TypeCategory[TypeCategory["trellis"] = 4] = "trellis";
})(TypeCategory = exports.TypeCategory || (exports.TypeCategory = {}));
class Types {
    constructor(name) {
        this.name = name;
    }
}
exports.Types = Types;
class Primitive extends Types {
    constructor(name) {
        super(name);
    }
    get_category() {
        return TypeCategory.primitive;
    }
    get_other_trellis_name() {
        throw Error("Primitive types do not point to a trellis.");
    }
}
exports.Primitive = Primitive;
class Decimal extends Primitive {
    constructor(name, precision) {
        super(name);
        this.precision = precision;
    }
}
exports.Decimal = Decimal;
class List_Type extends Types {
    constructor(name, child_type) {
        super(name);
        this.child_type = child_type;
    }
    get_category() {
        return TypeCategory.list;
    }
    get_other_trellis_name() {
        return this.child_type.get_other_trellis_name();
    }
}
exports.List_Type = List_Type;
//# sourceMappingURL=types.js.map