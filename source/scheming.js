"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (Type_Category) {
    Type_Category[Type_Category["primitive"] = 0] = "primitive";
    Type_Category[Type_Category["list"] = 1] = "list";
    Type_Category[Type_Category["trellis"] = 2] = "trellis";
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
    return Primitive;
}(Type));
exports.Primitive = Primitive;
var Trellis_Type = (function (_super) {
    __extends(Trellis_Type, _super);
    function Trellis_Type() {
        _super.apply(this, arguments);
    }
    Trellis_Type.prototype.get_category = function () {
        return Type_Category.trellis;
    };
    return Trellis_Type;
}(Type));
exports.Trellis_Type = Trellis_Type;
var List_Type = (function (_super) {
    __extends(List_Type, _super);
    function List_Type() {
        _super.apply(this, arguments);
    }
    List_Type.prototype.get_category = function () {
        return Type_Category.list;
    };
    return List_Type;
}(Type));
exports.List_Type = List_Type;
var Property = (function () {
    function Property(name, type, trellis) {
        this.name = name;
        this.type = type;
        this.trellis = trellis;
    }
    Property.prototype.get_path = function () {
        return this.trellis.name + '.' + this.name;
    };
    return Property;
}());
exports.Property = Property;
var Reference = (function (_super) {
    __extends(Reference, _super);
    function Reference() {
        _super.apply(this, arguments);
    }
    return Reference;
}(Property));
exports.Reference = Reference;
var List = (function (_super) {
    __extends(List, _super);
    function List() {
        _super.apply(this, arguments);
    }
    return List;
}(Property));
exports.List = List;
var Trellis = (function () {
    function Trellis(name) {
        this.properties = {};
        this.name = name;
    }
    return Trellis;
}());
exports.Trellis = Trellis;
var Library = (function () {
    function Library() {
        this.types = {
            String: new Primitive('string'),
            Int: new Primitive('int'),
        };
    }
    return Library;
}());
exports.Library = Library;
var Schema = (function () {
    function Schema() {
        this.trellises = {};
        this.library = new Library();
    }
    Schema.prototype.define = function (definitions) {
        var loader = new Loader(this.library);
        for (var name_1 in definitions) {
            var definition = definitions[name_1];
            this.trellises[name_1] = load_trellis(name_1, definition, loader);
        }
    };
    return Schema;
}());
exports.Schema = Schema;
var Loader = (function () {
    function Loader(library) {
        this.incomplete = {};
        this.library = library;
    }
    return Loader;
}());
function load_type(source, loader) {
    var types = loader.library.types;
    if (source == "string")
        return types.String;
    if (source == "int")
        return types.Int;
    throw Error("Not supported: " + JSON.stringify(source));
}
function load_property(name, source, trellis, loader) {
    var type = load_type(source, loader);
    return new Property(name, type, trellis);
}
function load_trellis(name, source, loader) {
    var trellis = new Trellis(name);
    for (var name_2 in source.properties) {
        var property = source.properties[name_2];
        trellis.properties[name_2] = load_property(name_2, property, trellis, loader);
    }
    return trellis;
}
//# sourceMappingURL=scheming.js.map