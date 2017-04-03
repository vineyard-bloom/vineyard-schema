"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (Type_Category) {
    Type_Category[Type_Category["incomplete"] = 0] = "incomplete";
    Type_Category[Type_Category["primitive"] = 1] = "primitive";
    Type_Category[Type_Category["list"] = 2] = "list";
    Type_Category[Type_Category["trellis"] = 3] = "trellis";
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
var Trellis_Type = (function (_super) {
    __extends(Trellis_Type, _super);
    function Trellis_Type(name, trellis) {
        _super.call(this, name);
        this.trellis = trellis;
    }
    Trellis_Type.prototype.get_category = function () {
        return Type_Category.trellis;
    };
    Trellis_Type.prototype.get_other_trellis_name = function () {
        return this.trellis.name;
    };
    return Trellis_Type;
}(Type));
exports.Trellis_Type = Trellis_Type;
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
var Incomplete_Type = (function (_super) {
    __extends(Incomplete_Type, _super);
    function Incomplete_Type(target_name, source) {
        _super.call(this, "Incomplete: " + target_name);
        this.target_name = target_name;
        this.source = source;
    }
    Incomplete_Type.prototype.get_category = function () {
        return Type_Category.incomplete;
    };
    Incomplete_Type.prototype.get_other_trellis_name = function () {
        return this.target_name;
    };
    return Incomplete_Type;
}(Type));
exports.Incomplete_Type = Incomplete_Type;
var Property = (function () {
    function Property(name, type, trellis) {
        this.nullable = false;
        this.name = name;
        this.type = type;
        this.trellis = trellis;
    }
    Property.prototype.get_path = function () {
        return this.trellis.name + '.' + this.name;
    };
    Property.prototype.is_reference = function () {
        return this.type.get_category() == Type_Category.trellis
            || this.type.get_category() == Type_Category.list
            || this.type.get_category() == Type_Category.incomplete;
    };
    return Property;
}());
exports.Property = Property;
var Reference = (function (_super) {
    __extends(Reference, _super);
    function Reference(name, type, trellis, other_property) {
        _super.call(this, name, type, trellis);
        this.other_property = other_property;
    }
    Reference.prototype.get_other_trellis = function () {
        return this.type.get_category() == Type_Category.trellis
            ? this.type.trellis
            : this.type.child_type.trellis;
    };
    return Reference;
}(Property));
exports.Reference = Reference;
var Trellis = (function () {
    function Trellis(name) {
        this.properties = {};
        this.name = name;
    }
    return Trellis;
}());
exports.Trellis = Trellis;
//# sourceMappingURL=trellis.js.map