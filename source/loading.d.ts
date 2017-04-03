import { Trellis } from "./trellis";
export declare class Library {
    types: any;
    constructor();
}
export declare class Loader {
    incomplete: {};
    library: Library;
    constructor(library: Library);
}
export declare function load_trellis(name: string, source: any, loader: Loader): Trellis;
