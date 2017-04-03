import {Trellis} from "./trellis"
import {Library, Loader, load_trellis} from "./loading"

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
    const loader = new Loader(this.library)

    for (let name in definitions) {
      const definition = definitions [name]
      this.trellises [name] = load_trellis(name, definition, loader)
    }

    for (let a in loader.incomplete) {
      throw Error("Unknown type '" + a + "'.")
    }
  }
}
