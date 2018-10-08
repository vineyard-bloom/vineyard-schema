import {Types, TypeCategory, List_Type} from './types'
import {Property, Table, Trellis} from "./types";

export class Trellis_Type extends Types {
  trellis: Trellis

  constructor(name: string, trellis: Trellis) {
    super(name)
    this.trellis = trellis
  }

  get_category(): TypeCategory {
    return TypeCategory.trellis
  }

  get_other_trellis_name(): string {
    return this.trellis.name
  }
}

export class StandardProperty implements Property {
  name: string
  type: Types
  trellis: Trellis
  is_nullable: boolean = false
  "default": any
  is_unique: boolean = false
  otherProperty?: Property = undefined

  constructor(name: string, type: Types, trellis: Trellis) {
    this.name = name
    this.type = type
    this.trellis = trellis
  }

  get_path(): string {
    return this.trellis.name + '.' + this.name
  }

  is_reference(): boolean {
    return this.type.get_category() == TypeCategory.trellis
      || this.type.get_category() == TypeCategory.list
      || this.type.get_category() == TypeCategory.incomplete
  }

  is_list(): boolean {
    return this.type.get_category() == TypeCategory.list
  }

  get_other_trellis(): Trellis {
    return this.type.get_category() == TypeCategory.trellis
      ? (this.type as Trellis_Type).trellis
      : ((this.type as List_Type).child_type as Trellis_Type).trellis
  }

}

export class Reference extends StandardProperty {

  constructor(name: string, type: Types, trellis: Trellis, other_property?: Property) {
    super(name, type, trellis)
    if (other_property)
      this.otherProperty = other_property
  }

}

function get_key_identity(data: any, name: string) {
  const id = data[name]
  if (id || id === 0)
    return id

  if (typeof data === 'object')
    throw new Error('Cannot retrieve identity from object because primary key "'
      + name + '" is missing.')

  return data
}

// export interface ITrellis {
//   name: string
//   properties: { [name: string]: Property }
//   primary_keys: Property[]
//   parent?: Trellis | null
// }

export class TrellisImplementation implements Trellis {
  table: Table
  name: string
  properties: { [name: string]: Property } = {}
  primary_keys: Property[] = []
  parent?: Trellis
  collection: any
  softDelete: boolean = false

  private lists: Reference[] = []
  additional: any = {}

  constructor(name: string, table: Table) {
    this.name = name
    this.table = table
  }

  get_lists(): Reference[] {
    if (this.lists)
      return this.lists

    const result: Reference[] = []
    for (let name in this.properties) {
      const property = this.properties [name]
      if (property.is_list())
        result.push(property as Reference)
    }

    this.lists = result
    return result
  }

  get_identity(data: any) {
    if (!data)
      throw new Error("Identity cannot be empty.")

    if (this.primary_keys.length > 1) {
      const result: { [name: string]: any } = {}
      for (let i = 0; i < this.primary_keys.length; ++i) {
        const property = this.primary_keys[i]
        result[property.name] = get_key_identity(data, property.name)
      }
      return result
    }

    return get_key_identity(data, this.primary_keys[0].name)
  }

  getIdentity(data: any) {
    return this.get_identity(data)
  }
}

export function getIdentity(trellis: Trellis, data: any) {
  if (!data)
    throw new Error("Identity cannot be empty.")

  if (trellis.primary_keys.length > 1) {
    const result: { [name: string]: any } = {}
    for (let i = 0; i < trellis.primary_keys.length; ++i) {
      const property = trellis.primary_keys[i]
      result[property.name] = get_key_identity(data, property.name)
    }
    return result
  }

  return get_key_identity(data, trellis.primary_keys[0].name)
}
