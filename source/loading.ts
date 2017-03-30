import {Primitive, Trellis, Type, Incomplete_Type, Reference, Property, Type_Category, Trellis_Type} from "./trellis"


export class Library {
  types

  constructor() {
    this.types = {
      bool: new Primitive('bool'),
      date: new Primitive('date'),
      float: new Primitive('float'),
      json: new Primitive('json'),
      int: new Primitive('int'),
      string: new Primitive('string'),
    }
  }
}

export class Loader {
  incomplete = {}
  library: Library

  constructor(library: Library) {
    this.library = library
  }
}

function load_type(source, loader: Loader): Type {
  const types = loader.library.types

  const result = types[source.type]
  if (result)
    return result

  if (source.type == 'list') {
    const result = types[source.trellis]
    if (result)
      return result

    return new Incomplete_Type(source.trellis, source)
  }

  return new Incomplete_Type(source.type, source)
  // throw Error("Not supported: " + JSON.stringify(source))
}

function find_other_reference(trellis: Trellis, other_trellis: Trellis): Reference {
  for (let name in other_trellis.properties) {
    const property = other_trellis.properties [name]
    if (property.is_reference()) {
      const reference = property as Reference
      if (reference.get_other_trellis() == trellis)
        return reference
    }
  }

  throw Error("Could not find other reference for " + trellis.name + " and " + other_trellis.name + ".")
}

function load_property(name: string, source, trellis: Trellis, loader: Loader): Property {
  const type = load_type(source, loader)
  if (type.get_category() == Type_Category.primitive) {
    return new Property(name, type, trellis)
  }
  else if (type.get_category() == Type_Category.trellis) {
    return new Reference(name, type, trellis, find_other_reference(trellis, (type as Trellis_Type).trellis))
  }
  else if (type.get_category() == Type_Category.list) {
    return new Reference(name, type, trellis, find_other_reference(trellis, (type as Trellis_Type).trellis))
  }
  else if (type.get_category() == Type_Category.incomplete) {
    const property = new Reference(name, type, trellis, null)
    const target = (type as Incomplete_Type).target_name
    const incomplete = loader.incomplete [target] = loader.incomplete [target] || []
    incomplete.push({
      property: property,
      source: source
    })
    return property
  }
}

function update_incomplete(trellis: Trellis, loader: Loader) {
  const incomplete = loader.incomplete[trellis.name]
  if (incomplete) {
    for (let i = 0; i < incomplete.length; ++i) {
      const entry = incomplete[i]
      const property = entry.property
      property.type = load_type(entry.source, loader)
      if (property.type.get_category() == Type_Category.incomplete)
        throw Error("Error resolving incomplete type.")
    }
    delete loader.incomplete[trellis.name]
  }

}

export function load_trellis(name: string, source, loader: Loader): Trellis {
  const trellis = new Trellis(name)
  loader.library.types[name] = new Trellis_Type(name, trellis)
  update_incomplete(trellis, loader)

  for (let name in source.properties) {
    const property = source.properties [name]
    trellis.properties [name] = load_property(name, property, trellis, loader)
  }

  return trellis
}
