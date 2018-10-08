import { Trellis, SchemaSource } from './types';
import { LibraryImplementation } from './library';
export declare function setSnakeCaseTables(value: boolean): void;
export declare function load_schema(definitions: SchemaSource, trellises: {
    [name: string]: Trellis;
}, library: LibraryImplementation): void;
