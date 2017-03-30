import { Trellis } from "./trellis";
import { Library } from "./loading";
export declare type Trellis_Map = {
    [name: string]: Trellis;
};
export declare class Schema {
    trellises: Trellis_Map;
    library: Library;
    constructor(definitions?: any);
    define(definitions: any): void;
}
