import { Type, Type_Category } from './type';
export declare class Trellis_Type extends Type {
    trellis: Trellis;
    constructor(name: string, trellis: Trellis);
    get_category(): Type_Category;
    get_other_trellis_name(): string;
}
export declare class Property {
    name: string;
    type: Type;
    trellis: Trellis;
    is_nullable: boolean;
    "default": any;
    is_unique: boolean;
    constructor(name: string, type: Type, trellis: Trellis);
    get_path(): string;
    is_reference(): boolean;
    is_list(): boolean;
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
    primary_keys: Property[];
    primary_key: Property;
    private lists;
    additional: any;
    constructor(name: string);
    get_lists(): Reference[];
    get_identity(data: any): any;
}
