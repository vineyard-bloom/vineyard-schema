"use strict";
var scheming = require('./scheming');
exports.scheming = scheming;
var apply_schema_1 = require("./apply_schema");
function initialize(schema, db) {
    // const definitions = scheming.get_definitions(bushel.schema)
    // const models = vineyard_mongoose.define_schema(definitions)
    apply_schema_1.apply_schema(schema, db);
}
exports.initialize = initialize;
//# sourceMappingURL=index.js.map