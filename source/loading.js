"use strict";
var trellis_1 = require("./trellis");
var Library = (function () {
    function Library() {
        this.types = {
            bool: new trellis_1.Primitive('bool'),
            date: new trellis_1.Primitive('date'),
            float: new trellis_1.Primitive('float'),
            json: new trellis_1.Primitive('json'),
            int: new trellis_1.Primitive('int'),
            string: new trellis_1.Primitive('string'),
        };
    }
    return Library;
}());
exports.Library = Library;
var Loader = (function () {
    function Loader(library) {
        this.incomplete = {};
        this.library = library;
    }
    return Loader;
}());
exports.Loader = Loader;
function load_type(source, loader) {
    var types = loader.library.types;
    var result = types[source.type];
    if (result)
        return result;
    if (source.type == 'list') {
        var result_1 = types[source.trellis];
        if (result_1)
            return result_1;
        return new trellis_1.Incomplete_Type(source.trellis, source);
    }
    return new trellis_1.Incomplete_Type(source.type, source);
    // throw Error("Not supported: " + JSON.stringify(source))
}
function find_other_reference(trellis, other_trellis) {
    for (var name_1 in other_trellis.properties) {
        var property = other_trellis.properties[name_1];
        if (property.is_reference()) {
            var reference = property;
            if (reference.get_other_trellis() == trellis)
                return reference;
        }
    }
    throw Error("Could not find other reference for " + trellis.name + " and " + other_trellis.name + ".");
}
function load_property(name, source, trellis, loader) {
    var type = load_type(source, loader);
    if (type.get_category() == trellis_1.Type_Category.primitive) {
        return new trellis_1.Property(name, type, trellis);
    }
    else if (type.get_category() == trellis_1.Type_Category.trellis) {
        return new trellis_1.Reference(name, type, trellis, find_other_reference(trellis, type.trellis));
    }
    else if (type.get_category() == trellis_1.Type_Category.list) {
        return new trellis_1.Reference(name, type, trellis, find_other_reference(trellis, type.trellis));
    }
    else if (type.get_category() == trellis_1.Type_Category.incomplete) {
        var property = new trellis_1.Reference(name, type, trellis, null);
        var target = type.target_name;
        var incomplete = loader.incomplete[target] = loader.incomplete[target] || [];
        incomplete.push({
            property: property,
            source: source
        });
        return property;
    }
}
function update_incomplete(trellis, loader) {
    var incomplete = loader.incomplete[trellis.name];
    if (incomplete) {
        for (var i = 0; i < incomplete.length; ++i) {
            var entry = incomplete[i];
            var property = entry.property;
            property.type = load_type(entry.source, loader);
            if (property.type.get_category() == trellis_1.Type_Category.incomplete)
                throw Error("Error resolving incomplete type.");
        }
        delete loader.incomplete[trellis.name];
    }
}
function load_trellis(name, source, loader) {
    var trellis = new trellis_1.Trellis(name);
    loader.library.types[name] = new trellis_1.Trellis_Type(name, trellis);
    update_incomplete(trellis, loader);
    for (var name_2 in source.properties) {
        var property = source.properties[name_2];
        trellis.properties[name_2] = load_property(name_2, property, trellis, loader);
    }
    return trellis;
}
exports.load_trellis = load_trellis;
