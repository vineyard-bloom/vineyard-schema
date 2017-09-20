"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var type_1 = require("./type");
var Trellis_Type = (function (_super) {
    __extends(Trellis_Type, _super);
    function Trellis_Type(name, trellis) {
        var _this = _super.call(this, name) || this;
        _this.trellis = trellis;
        return _this;
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
        var _this = _super.call(this, name, type, trellis) || this;
        _this.other_property = other_property;
        return _this;
    }
    Reference.prototype.get_other_trellis = function () {
        return this.type.get_category() == type_1.Type_Category.trellis
            ? this.type.trellis
            : this.type.child_type.trellis;
    };
    return Reference;
}(Property));
exports.Reference = Reference;
function get_key_identity(data, name) {
    var id = data[name];
    if (id)
        return id;
    if (typeof data === 'object')
        throw new Error('Cannot retrieve identity from object because primary key "'
            + name + '" is missing.');
    return data;
}
var Trellis = (function () {
    function Trellis(name) {
        this.properties = {};
        this.primary_keys = [];
        this.parent = null;
        this.additional = {};
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
        if (this.primary_keys.length > 1) {
            var result = {};
            for (var i = 0; i < this.primary_keys.length; ++i) {
                var property = this.primary_keys[i];
                result[property.name] = get_key_identity(data, property.name);
            }
            return result;
        }
        return get_key_identity(data, this.primary_keys[0].name);
    };
    Trellis.prototype.getIdentity = function (data) {
        return this.get_identity(data);
    };
    return Trellis;
}());
exports.Trellis = Trellis;
//# sourceMappingURL=trellis.js.map