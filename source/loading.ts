import {Library} from './library'
import {
  Trellis,
  Type,
  Reference,
  Property,
  Type_Category,
  Trellis_Type,
  List_Type
} from "./trellis"

class Incomplete_Type extends Type {
  target_name: string
  source

  constructor(target_name: string, source) {
    super("Incomplete: " + target_name)
    this.target_name = target_name
    this.source = source
  }

  get_category(): Type_Category {
    return Type_Category.incomplete
  }

  get_other_trellis_name(): string {
    return this.target_name
  }
}

export interface Property_Source {
  type: string
  trellis?: string
  nullable?: boolean
  "default"?:  any
}

export interface Trellis_Source {
  properties: {[name: string]: Property_Source}
}

export type Schema_Source = {[name: string]: Trellis_Source}

interface Incomplete_Reference {
  property: Property
  source: Property_Source
}

type Incomplete_Map = {[trellis_name: string]: Incomplete_Reference[]}

class Loader {
  incomplete: Incomplete_Map = {}
  library: Library

  constructor(library: Library) {
    this.library = library
  }
}

function load_type(source: Property_Source, loader: Loader): Type {
  const types = loader.library.types

  const result = types[source.type]
  if (result)
    return result

  if (source.type == 'list') {
    const result = types[source.trellis]
    if (result)
      return new List_Type(result.name, result)

    return new Incomplete_Type(source.trellis, source)
  }

  return new Incomplete_Type(source.type, source)
  // throw Error("Not supported: " + JSON.stringify(source))
}

function find_other_references(trellis: Trellis, other_trellis: Trellis): Reference[] {
  const result = []
  for (let name in other_trellis.properties) {
    const property = other_trellis.properties [name]
    if (property.is_reference()) {
      const reference = property as Reference
      if (reference.type.get_other_trellis_name() == trellis.name)
        result.push(reference)
    }
  }
  return result
}

function find_other_reference_or_null(trellis: Trellis, other_trellis: Trellis): Reference {
  const references = find_other_references(trellis, other_trellis)
  if (references.length > 1)
    throw Error("Multiple ambiguous other references for " + trellis.name + " and " + other_trellis.name + ".")

  return references [0]
}

function find_other_reference(trellis: Trellis, other_trellis: Trellis): Reference {
  const reference = find_other_reference_or_null(trellis, other_trellis)
  if (!reference)
    throw Error("Could not find other reference for " + trellis.name + " and " + other_trellis.name + ".")

  return reference
}

function load_property(name: string, source: Property_Source, trellis: Trellis, loader: Loader): Property {
  const type = load_type(source, loader)
  if (type.get_category() == Type_Category.primitive) {
    return new Property(name, type, trellis)
  }
  else if (type.get_category() == Type_Category.trellis) {
    return new Reference(name, type, trellis, find_other_reference_or_null(trellis, (type as Trellis_Type).trellis))
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
      const type = property.type = load_type(entry.source, loader)
      if (type.get_category() == Type_Category.incomplete)
        throw Error("Error resolving incomplete type.")

      if (type.get_category() == Type_Category.trellis) {
        (property as Reference).other_property = find_other_reference_or_null(property.trellis, trellis)
      }
      else {
        (property as Reference).other_property = find_other_reference(property.trellis, trellis)
      }
    }
    delete loader.incomplete[trellis.name]
  }

}

function load_trellis(name: string, source: Trellis_Source, loader: Loader): Trellis {
  const trellis = new Trellis(name)
  loader.library.types[name] = new Trellis_Type(name, trellis)

  for (let name in source.properties) {
    const property_source = source.properties [name]
    const property = trellis.properties [name] = load_property(name, property_source, trellis, loader)
    if (property_source.nullable === true)
      property.nullable = true

    property.default = property_source.default
  }

  if (!trellis.properties['id']) {
    trellis.properties['id'] = new Property('id', loader.library.types.guid, trellis)
  }

  trellis.primary_key = trellis.properties['id']

  update_incomplete(trellis, loader)

  return trellis
}

export function load_schema(definitions: Schema_Source, trellises: {[name: string]: Trellis}, library: Library) {
  const loader = new Loader(library)

  for (let name in definitions) {
    const definition = definitions [name]
    trellises [name] = load_trellis(name, definition, loader)
  }

  for (let a in loader.incomplete) {
    throw Error("Unknown type '" + a + "'.")
  }
}
