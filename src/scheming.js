"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const library_1 = require("./library");
const loading_1 = require("./loading");
function newSchema(definitions) {
    const schema = {
        trellises: {},
        library: new library_1.LibraryImplementation()
    };
    loading_1.load_schema(definitions, schema.trellises, schema.library);
    return schema;
}
exports.newSchema = newSchema;
//# sourceMappingURL=scheming.js.map