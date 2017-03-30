"use strict";
var trellis_1 = require("./trellis");
var Sequelize = require('sequelize');
function get_field(property, library) {
    var type = property.type;
    if (type.get_category() == trellis_1.Type_Category.primitive) {
        if (type === library.types.int) {
            return {
                type: Sequelize.INTEGER,
                nullable: false
            };
        }
        if (type === library.types.string) {
            return {
                type: Sequelize.STRING,
                nullable: false
            };
        }
        if (type === library.types.json) {
            return {
                type: Sequelize.JSON,
                nullable: false
            };
        }
        if (type === library.types.bool) {
            return {
                type: Sequelize.BOOLEAN,
                nullable: false
            };
        }
        if (type === library.types.float) {
            return {
                type: Sequelize.FLOAT,
                nullable: false
            };
        }
        if (type === library.types.date) {
            return {
                type: Sequelize.DATE,
                nullable: false
            };
        }
    }
    else if (type.get_category() == trellis_1.Type_Category.list) {
        return null;
    }
    else if (type.get_category() == trellis_1.Type_Category.trellis) {
        if (library.types[type.name]) {
            // return library.types [type.name]
            return null;
        }
    }
    throw Error("Not implemented or supported");
}
function vineyard_to_sequelize(schema, sequelize) {
    for (var name_1 in schema.trellises) {
        var trellis = schema.trellises[name_1];
        var fields = {};
        for (var i in trellis.properties) {
            var field = get_field(trellis.properties[i], schema.library);
            if (field)
                fields[i] = field;
        }
        trellis.table = sequelize.define(trellis.name, fields, {
            underscored: true,
            createdAt: 'created',
            updatedAt: 'modified',
        });
    }
    for (var name_2 in schema.trellises) {
        var trellis = schema.trellises[name_2];
        for (var i in trellis.properties) {
            var property = trellis.properties[i];
            if (property.type.get_category() == trellis_1.Type_Category.trellis) {
                var reference = property;
            }
            else if (property.type.get_category() == trellis_1.Type_Category.list) {
                var list = property;
                trellis.table.hasMany(list.get_other_trellis().table, {
                    as: list.name,
                    foreignKey: list.other_property.name
                });
            }
        }
    }
}
exports.vineyard_to_sequelize = vineyard_to_sequelize;
//# sourceMappingURL=database.js.map