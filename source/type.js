"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (Type_Category) {
    Type_Category[Type_Category["incomplete"] = 0] = "incomplete";
    Type_Category[Type_Category["decimal"] = 1] = "decimal";
    Type_Category[Type_Category["primitive"] = 2] = "primitive";
    Type_Category[Type_Category["list"] = 3] = "list";
    Type_Category[Type_Category["trellis"] = 4] = "trellis";
})(exports.Type_Category || (exports.Type_Category = {}));
var Type_Category = exports.Type_Category;
var Type = (function () {
    function Type(name) {
        this.name = name;
    }
    return Type;
}());
exports.Type = Type;
var Primitive = (function (_super) {
    __extends(Primitive, _super);
    function Primitive(name) {
        _super.call(this, name);
    }
    Primitive.prototype.get_category = function () {
        return Type_Category.primitive;
    };
    Primitive.prototype.get_other_trellis_name = function () {
        throw Error("Primitive types do not point to a trellis.");
    };
    return Primitive;
}(Type));
exports.Primitive = Primitive;
var Decimal = (function (_super) {
    __extends(Decimal, _super);
    function Decimal(name, precision) {
        _super.call(this, name);
        this.precision = precision;
    }
    return Decimal;
}(Primitive));
exports.Decimal = Decimal;
var List_Type = (function (_super) {
    __extends(List_Type, _super);
    function List_Type(name, child_type) {
        _super.call(this, name);
        this.child_type = child_type;
    }
    List_Type.prototype.get_category = function () {
        return Type_Category.list;
    };
    List_Type.prototype.get_other_trellis_name = function () {
        return this.child_type.get_other_trellis_name();
    };
    return List_Type;
}(Type));
exports.List_Type = List_Type;
//# sourceMappingURL=type.js.map