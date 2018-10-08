import {
  List_Type,
  Types,
  TypeCategory,
  TrellisSource,
  PropertySource,
  Trellis,
  Table,
  Property,
  SchemaSource
} from './types'
import { LibraryImplementation } from './library'
import { Reference, StandardProperty, Trellis_Type, TrellisImplementation } from "./trellis"
import { to_lower_snake_case } from "./utility"

const pluralize = require('pluralize')

let snakeCaseTables: boolean = true

export function setSnakeCaseTables(value: boolean) {
  snakeCaseTables = value
}

class Incomplete_Type extends Types {
  target_name: string
  source: any

  constructor(target_name: string, source: any) {
    super("Incomplete: " + target_name)
    this.target_name = target_name
    this.source = source
  }

  get_category(): TypeCategory {
    return TypeCategory.incomplete
  }

  get_other_trellis_name(): string {
    return this.target_name
  }
}

interface IncompleteReference {
  property: Reference
  source: PropertySource
}

type IncompleteMap = { [trellis_name: string]: IncompleteReference[] }

class Loader {
  incomplete: IncompleteMap = {}
  library: LibraryImplementation

  constructor(library: LibraryImplementation) {
    this.library = library
  }
}

function load_type(source: PropertySource, loader: Loader): Types {
  const types = loader.library.types

  const result = types[source.type]
  if (result)
    return result

  if (source.type == 'List') {
    if (source.trellis) {
      const result = types[source.trellis]
      if (result)
        return new List_Type(result.name, result)
    }

    return new Incomplete_Type(source.trellis || "", source)
  }

  return new Incomplete_Type(source.type, source)
  // throw Error("Not supported: " + JSON.stringify(source))
}

function find_other_references(trellis: Trellis, other_trellis: Trellis): Property[] {
  const result: any = []
  for (let name in other_trellis.properties) {
    const property = other_trellis.properties [name]
    if (property.is_reference()) {
      const reference = property
      if (reference.type.get_other_trellis_name() == trellis.name)
        result.push(reference)
    }
  }
  return result
}

function find_other_reference_or_null(trellis: Trellis, other_trellis: Trellis): Property {
  const references = find_other_references(trellis, other_trellis)
  if (references.length > 1)
    console.error("Multiple ambiguous other references for " + trellis.name + " and " + other_trellis.name + ".")
  // throw Error("Multiple ambiguous other references for " + trellis.name + " and " + other_trellis.name + ".")

  return references [0]
}

function find_other_reference(trellis: Trellis, other_trellis: Trellis): Property {
  const reference = find_other_reference_or_null(trellis, other_trellis)
  if (!reference)
    throw Error("Could not find other reference for " + trellis.name + " and " + other_trellis.name + ".")

  return reference
}

function load_property_inner(name: string, source: PropertySource, trellis: Trellis, loader: Loader): Property {
  if (!source.type)
    throw new Error(trellis.name + "." + name + " is missing a type property.")

  const type = load_type(source, loader)
  if (type.get_category() == TypeCategory.primitive) {
    return new StandardProperty(name, type, trellis)
  }
  else if (type.get_category() == TypeCategory.trellis) {
    return new Reference(name, type, trellis, find_other_reference_or_null(trellis, (type as Trellis_Type).trellis))
  }
  else if (type.get_category() == TypeCategory.list) {
    const list_type = type as List_Type
    return new Reference(name, type, trellis, find_other_reference(trellis, (list_type.child_type as Trellis_Type).trellis))
  }
  else if (type.get_category() == TypeCategory.incomplete) {
    const property = new Reference(name, type, trellis)
    const target = (type as Incomplete_Type).target_name
    const incomplete = loader.incomplete [target] = loader.incomplete [target] || []
    incomplete.push({
      property: property,
      source: source
    })
    return property
  }
  else {
    throw new Error("Unsupported property type")
  }
}

function load_property(name: string, property_source: PropertySource, trellis: Trellis, loader: Loader): Property {
  const property = trellis.properties [name] = load_property_inner(name, property_source, trellis, loader)
  if (property_source.nullable === true)
    property.is_nullable = true

  if (property_source.enumValues)
    property.enumValues = property_source.enumValues

  if (property_source.unique === true)
    property.is_unique = true

  if (property_source.length)
    property.length = property_source.length

  if (typeof property_source.autoIncrement === 'boolean')
    property.autoIncrement = property_source.autoIncrement

  property.default = property.is_nullable
    ? null
    : (property_source.defaultValue !== undefined
      ? property_source.defaultValue
      : property_source.default)

  return property
}

function update_incomplete(trellis: Trellis, loader: Loader) {
  const incomplete = loader.incomplete[trellis.name]
  if (incomplete) {
    for (let i = 0; i < incomplete.length; ++i) {
      const entry = incomplete[i]
      const property = entry.property
      const type = property.type = load_type(entry.source, loader)
      if (type.get_category() == TypeCategory.incomplete)
        throw Error("Error resolving incomplete type.")

      if (type.get_category() == TypeCategory.trellis) {
        property.otherProperty = find_other_reference_or_null(property.trellis, trellis)
      }
      else {
        property.otherProperty = find_other_reference(property.trellis, trellis)
      }
    }
    delete loader.incomplete[trellis.name]
  }
}

function initialize_primary_key(primary_key: string, trellis: Trellis, loader: Loader) {

  if (primary_key == 'id' && !trellis.properties['id'])
    trellis.properties['id'] = new StandardProperty('id', loader.library.types.Uuid, trellis)

  if (!trellis.properties[primary_key])
    throw new Error("Could not find primary key " + trellis.name + '.' + primary_key + '.')

  return trellis.properties[primary_key]
}

function format_primary_keys(primary_keys: any, trellis_name: string) {
  if (!primary_keys)
    return ['id']

  if (typeof primary_keys == 'string')
    return [primary_keys]

  if (Array.isArray(primary_keys))
    return primary_keys

  throw new Error("Invalid primary keys format for trellis " + trellis_name + '.')
}

function initialize_primary_keys(trellis: Trellis, source: TrellisSource, loader: Loader) {
  const initialPrimaryKeys = source.primaryKeys || source.primary || source.primary_key
  const primaryKeys = format_primary_keys(initialPrimaryKeys, trellis.name)
  for (let i = 0; i < primaryKeys.length; ++i) {
    trellis.primary_keys.push(initialize_primary_key(primaryKeys[i], trellis, loader))
  }
}

// loadIndexes function returns an array of indexes
function loadIndexes(source: TrellisSource) {
  if (!source.table || !source.table.indexes)
    return []

  return source.table.indexes.map(indexSource =>
    ({
      properties: indexSource.properties.map(name => name)
    })
  )
}

function load_trellis(name: string, source: TrellisSource, loader: Loader): Trellis {
  const sourceTable = source.table || { name: undefined }
  const table: Table = {
    name: sourceTable.name || pluralize(snakeCaseTables ? to_lower_snake_case(name) : name.toLowerCase()),
    // Call loadIndexes function to assign indexes to trellis.table.indexes
    indexes: loadIndexes(source)
  }
  const trellis = new TrellisImplementation(name, table)
  loader.library.types[name] = new Trellis_Type(name, trellis)

  for (let name in source.properties) {
    const property_source = source.properties [name]
    trellis.properties [name] = load_property(name, property_source, trellis, loader)
  }

  if (source.additional)
    trellis.additional = source.additional

  if (source.softDelete)
    trellis.softDelete = true

  initialize_primary_keys(trellis, source, loader)
  update_incomplete(trellis, loader)

  return trellis
}

export function load_schema(definitions: SchemaSource, trellises: { [name: string]: Trellis }, library: LibraryImplementation) {
  const loader = new Loader(library)

  for (let name in definitions) {
    const definition = definitions [name]
    trellises [name] = load_trellis(name, definition, loader)
  }

  for (let name in definitions) {
    const definition = definitions [name]
    if (typeof definition.parent == 'string') {
      if (!trellises[definition.parent])
        throw Error("Invalid parent trellis: " + definition.parent + '.')

      trellises [name].parent = trellises [definition.parent]
    }
  }

  for (let a in loader.incomplete) {
    throw Error("Unknown type '" + a + "'.")
  }
}
