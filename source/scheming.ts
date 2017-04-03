import {Trellis} from "./trellis"
import {Library} from './library'
import {load_schema} from "./loading"

export type Trellis_Map = {[name: string]: Trellis}

export class Schema {
  trellises: Trellis_Map = {}
  library: Library = new Library()

  constructor(definitions = undefined) {
    if (definitions) {
      this.define(definitions)
    }
  }

  define(definitions) {
    load_schema(definitions, this.trellises, this.library)
  }
}
