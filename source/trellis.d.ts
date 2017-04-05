export declare enum Type_Category {
    incomplete = 0,
    primitive = 1,
    list = 2,
    trellis = 3,
}
export declare abstract class Type {
    name: string;
    constructor(name: string);
    abstract get_category(): Type_Category;
    abstract get_other_trellis_name(): string;
}
export declare class Primitive extends Type {
    constructor(name: string);
    get_category(): Type_Category;
    get_other_trellis_name(): string;
}
export declare class Trellis_Type extends Type {
    trellis: Trellis;
    constructor(name: string, trellis: Trellis);
    get_category(): Type_Category;
    get_other_trellis_name(): string;
}
export declare class List_Type extends Type {
    child_type: Type;
    constructor(name: string, child_type: Type);
    get_category(): Type_Category;
    get_other_trellis_name(): string;
}
export declare class Property {
    name: string;
    type: Type;
    trellis: Trellis;
    nullable: boolean;
    "default": any;
    constructor(name: string, type: Type, trellis: Trellis);
    get_path(): string;
    is_reference(): boolean;
}
export declare class Reference extends Property {
    other_property: Property;
    constructor(name: string, type: Type, trellis: Trellis, other_property: Property);
    get_other_trellis(): Trellis;
}
export declare class Trellis {
    name: string;
    properties: {
        [name: string]: Property;
    };
    primary_key: Property;
    constructor(name: string);
}
