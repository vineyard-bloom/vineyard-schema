import { Library } from './library';
import { Trellis } from "./trellis";
export interface Property_Source {
    type: string;
    trellis?: string;
    nullable?: boolean;
    "default"?: any;
}
export interface Trellis_Source {
    properties: {
        [name: string]: Property_Source;
    };
}
export declare type Schema_Source = {
    [name: string]: Trellis_Source;
};
export declare function load_schema(definitions: Schema_Source, trellises: {
    [name: string]: Trellis;
}, library: Library): void;
