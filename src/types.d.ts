export declare enum TypeCategory {
    incomplete = 0,
    decimal = 1,
    primitive = 2,
    list = 3,
    trellis = 4
}
export interface Type {
    name: string;
    get_category(): TypeCategory;
    get_other_trellis_name(): string;
}
export declare abstract class Types {
    name: string;
    constructor(name: string);
    abstract get_category(): TypeCategory;
    abstract get_other_trellis_name(): string;
}
export declare class Primitive extends Types {
    constructor(name: string);
    get_category(): TypeCategory;
    get_other_trellis_name(): string;
}
export declare type Precision = number[];
export declare class Decimal extends Primitive {
    precision: Precision;
    constructor(name: string, precision: Precision);
}
export declare class List_Type extends Types {
    child_type: Types;
    constructor(name: string, child_type: Types);
    get_category(): TypeCategory;
    get_other_trellis_name(): string;
}
export interface PropertySource {
    type: string;
    trellis?: string;
    nullable?: boolean;
    "default"?: any;
    defaultValue?: any;
    unique?: boolean;
    autoIncrement?: boolean;
    length?: number;
    enumValues?: any[];
}
export interface IndexSource {
    name?: string;
    properties: string[];
}
export interface TableSource {
    name?: string;
    indexes: IndexSource[];
}
export interface Index {
    properties: string[];
}
export interface TrellisSource {
    primary_key?: string | string[];
    primaryKeys?: string[];
    primary?: string | string[];
    properties: {
        [name: string]: PropertySource;
    };
    additional?: any;
    parent?: string;
    table?: TableSource;
    softDelete?: boolean;
}
export declare type SchemaSource = {
    [name: string]: TrellisSource;
};
export interface Property {
    name: string;
    type: Type;
    trellis: Trellis;
    is_nullable: boolean;
    "default": any;
    is_unique: boolean;
    otherProperty?: Property;
    crossTable?: string;
    autoIncrement?: boolean;
    length?: number;
    enumValues?: any[];
    is_reference(): boolean;
    is_list(): boolean;
    get_other_trellis(): Trellis;
    get_path(): string;
}
export interface Table {
    name: string;
    isCross?: boolean;
    indexes: Index[];
}
export interface Trellis {
    table: Table;
    name: string;
    properties: {
        [name: string]: Property;
    };
    primary_keys: Property[];
    additional: any;
    collection: any;
    parent?: Trellis;
    softDelete?: boolean;
    get_identity(input: any): any;
    get_lists(): any;
}
export declare type TrellisMap = {
    [name: string]: Trellis;
};
export declare type TypeMap = {
    [name: string]: Type;
};
export interface Library {
    types: TypeMap;
}
export interface Schema {
    trellises: TrellisMap;
    library: Library;
}
