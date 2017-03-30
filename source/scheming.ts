export enum Type_Category {
  primitive,
  list,
  trellis
}

export abstract class Type {
  name: string

  constructor(name: string) {
    this.name = name
  }

  abstract get_category(): Type_Category
}

export class Primitive extends Type {

  constructor(name: string) {
    super(name)
  }

  get_category(): Type_Category {
    return Type_Category.primitive
  }
}

export class Trellis_Type extends Type {
  trellis: Trellis

  get_category(): Type_Category {
    return Type_Category.trellis
  }
}

export class List_Type extends Type {
  child_type: Type

  get_category(): Type_Category {
    return Type_Category.list
  }
}

export class Property {
  name: string
  type: Type
  trellis: Trellis

  constructor(name: string, type: Type, trellis: Trellis) {
    this.name = name
    this.type = type
    this.trellis = trellis
  }

  get_path(): string {
    return this.trellis.name + '.' + this.name
  }
}

export class Reference extends Property {
  other_property: Property
  other_trellis: Trellis
}

export class List extends Property {
  other_property: Property
  other_trellis: Trellis
}

export class Trellis {
  name: string
  properties: {[name: string]: Property} = {}
  table

  constructor(name: string) {
    this.name = name
  }
}

export class Library {
  types

  constructor() {
    this.types = {
      String: new Primitive('string'),
      Int: new Primitive('int'),
    }
  }
}

export class Schema {
  trellises: {[name: string]: Trellis} = {}
  library: Library = new Library()

  define(definitions) {
    const loader = new Loader(this.library)

    for (let name in definitions) {
      const definition = definitions [name]
      this.trellises [name] = load_trellis(name, definition, loader)
    }
  }
}

class Loader {
  incomplete = {}
  library: Library

  constructor(library: Library) {
    this.library = library
  }
}

function load_type(source, loader: Loader) {
  const types = loader.library.types

  if (source == "string")
    return types.String

  if (source == "int")
    return types.Int

  throw Error("Not supported: " + JSON.stringify(source))
}

function load_property(name: string, source, trellis: Trellis, loader: Loader) {
  const type = load_type(source, loader)
  return new Property(name, type, trellis)
}

function load_trellis(name: string, source, loader: Loader) {
  const trellis = new Trellis(name)
  for (let name in source.properties) {
    const property = source.properties [name]
    trellis.properties [name] = load_property(name, property, trellis, loader)
  }
  return trellis
}
