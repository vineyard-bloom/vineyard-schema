import { Types } from "./types";
export declare type Type_Map = {
    [name: string]: Types;
};
export declare class LibraryImplementation {
    types: Type_Map;
    constructor();
    add_type(type: Types): void;
}
