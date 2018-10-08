"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
class Trellis_Type extends types_1.Types {
    constructor(name, trellis) {
        super(name);
        this.trellis = trellis;
    }
    get_category() {
        return types_1.TypeCategory.trellis;
    }
    get_other_trellis_name() {
        return this.trellis.name;
    }
}
exports.Trellis_Type = Trellis_Type;
class StandardProperty {
    constructor(name, type, trellis) {
        this.is_nullable = false;
        this.is_unique = false;
        this.otherProperty = undefined;
        this.name = name;
        this.type = type;
        this.trellis = trellis;
    }
    get_path() {
        return this.trellis.name + '.' + this.name;
    }
    is_reference() {
        return this.type.get_category() == types_1.TypeCategory.trellis
            || this.type.get_category() == types_1.TypeCategory.list
            || this.type.get_category() == types_1.TypeCategory.incomplete;
    }
    is_list() {
        return this.type.get_category() == types_1.TypeCategory.list;
    }
    get_other_trellis() {
        return this.type.get_category() == types_1.TypeCategory.trellis
            ? this.type.trellis
            : this.type.child_type.trellis;
    }
}
exports.StandardProperty = StandardProperty;
class Reference extends StandardProperty {
    constructor(name, type, trellis, other_property) {
        super(name, type, trellis);
        if (other_property)
            this.otherProperty = other_property;
    }
}
exports.Reference = Reference;
function get_key_identity(data, name) {
    const id = data[name];
    if (id || id === 0)
        return id;
    if (typeof data === 'object')
        throw new Error('Cannot retrieve identity from object because primary key "'
            + name + '" is missing.');
    return data;
}
// export interface ITrellis {
//   name: string
//   properties: { [name: string]: Property }
//   primary_keys: Property[]
//   parent?: Trellis | null
// }
class TrellisImplementation {
    constructor(name, table) {
        this.properties = {};
        this.primary_keys = [];
        this.softDelete = false;
        this.lists = [];
        this.additional = {};
        this.name = name;
        this.table = table;
    }
    get_lists() {
        if (this.lists)
            return this.lists;
        const result = [];
        for (let name in this.properties) {
            const property = this.properties[name];
            if (property.is_list())
                result.push(property);
        }
        this.lists = result;
        return result;
    }
    get_identity(data) {
        if (!data)
            throw new Error("Identity cannot be empty.");
        if (this.primary_keys.length > 1) {
            const result = {};
            for (let i = 0; i < this.primary_keys.length; ++i) {
                const property = this.primary_keys[i];
                result[property.name] = get_key_identity(data, property.name);
            }
            return result;
        }
        return get_key_identity(data, this.primary_keys[0].name);
    }
    getIdentity(data) {
        return this.get_identity(data);
    }
}
exports.TrellisImplementation = TrellisImplementation;
function getIdentity(trellis, data) {
    if (!data)
        throw new Error("Identity cannot be empty.");
    if (trellis.primary_keys.length > 1) {
        const result = {};
        for (let i = 0; i < trellis.primary_keys.length; ++i) {
            const property = trellis.primary_keys[i];
            result[property.name] = get_key_identity(data, property.name);
        }
        return result;
    }
    return get_key_identity(data, trellis.primary_keys[0].name);
}
exports.getIdentity = getIdentity;
//# sourceMappingURL=trellis.js.map