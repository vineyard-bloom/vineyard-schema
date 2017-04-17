"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var type_1 = require('./type');
var Trellis_Type = (function (_super) {
    __extends(Trellis_Type, _super);
    function Trellis_Type(name, trellis) {
        _super.call(this, name);
        this.trellis = trellis;
    }
    Trellis_Type.prototype.get_category = function () {
        return type_1.Type_Category.trellis;
    };
    Trellis_Type.prototype.get_other_trellis_name = function () {
        return this.trellis.name;
    };
    return Trellis_Type;
}(type_1.Type));
exports.Trellis_Type = Trellis_Type;
var Property = (function () {
    function Property(name, type, trellis) {
        this.is_nullable = false;
        this.is_unique = false;
        this.name = name;
        this.type = type;
        this.trellis = trellis;
    }
    Property.prototype.get_path = function () {
        return this.trellis.name + '.' + this.name;
    };
    Property.prototype.is_reference = function () {
        return this.type.get_category() == type_1.Type_Category.trellis
            || this.type.get_category() == type_1.Type_Category.list
            || this.type.get_category() == type_1.Type_Category.incomplete;
    };
    Property.prototype.is_list = function () {
        return this.type.get_category() == type_1.Type_Category.list;
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
        return this.type.get_category() == type_1.Type_Category.trellis
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
    Trellis.prototype.get_lists = function () {
        if (this.lists)
            return this.lists;
        var result = [];
        for (var name_1 in this.properties) {
            var property = this.properties[name_1];
            if (property.is_list())
                result.push(property);
        }
        this.lists = result;
        return result;
    };
    Trellis.prototype.get_identity = function (data) {
        if (!data)
            throw new Error("Identity cannot be empty.");
        var id = data[this.primary_key.name];
        if (id)
            return id;
        if (typeof data === 'object')
            throw new Error('Cannot retrieve identity from object because primary key "'
                + this.primary_key.name + '" is missing.');
        return data;
    };
    return Trellis;
}());
exports.Trellis = Trellis;
//# sourceMappingURL=trellis.js.map