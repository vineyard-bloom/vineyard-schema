export enum TypeCategory {
  incomplete,
  decimal,
  primitive,
  list,
  trellis,
}

export interface Type {
  name: string

  get_category(): TypeCategory

  get_other_trellis_name(): string
}

export abstract class Types {
  name: string

  constructor(name: string) {
    this.name = name
  }

  abstract get_category(): TypeCategory

  abstract get_other_trellis_name(): string
}

export class Primitive extends Types {

  constructor(name: string) {
    super(name)
  }

  get_category(): TypeCategory {
    return TypeCategory.primitive
  }

  get_other_trellis_name(): string {
    throw Error("Primitive types do not point to a trellis.")
  }
}

export type Precision = number []

export class Decimal extends Primitive {
  precision: Precision

  constructor(name: string, precision: Precision) {
    super(name)
    this.precision = precision
  }
}

export class List_Type extends Types {
  child_type: Types

  constructor(name: string, child_type: Types) {
    super(name)
    this.child_type = child_type
  }

  get_category(): TypeCategory {
    return TypeCategory.list
  }

  get_other_trellis_name(): string {
    return this.child_type.get_other_trellis_name()
  }
}

export interface PropertySource {
  type: string
  trellis?: string
  nullable?: boolean
  "default"?: any
  defaultValue?: any
  unique?: boolean
  autoIncrement?: boolean
  length?: number
  enumValues?: any[]
}

export interface IndexSource {
  name?: string // Not implemented yet
  properties: string[]
}

export interface TableSource {
  name?: string
  indexes: IndexSource[]
}

export interface Index {
  properties: string[]
}

export interface TrellisSource {
  primary_key?: string | string[] // Deprecated
  primaryKeys?: string[]
  primary?: string | string[] // Deprecated
  properties: { [name: string]: PropertySource }
  additional?: any
  parent?: string
  table?: TableSource
  softDelete?: boolean
}

export type SchemaSource = { [name: string]: TrellisSource }

export interface Property {
  name: string
  type: Type
  trellis: Trellis
  is_nullable: boolean
  "default": any
  is_unique: boolean
  otherProperty?: Property
  crossTable?: Trellis
  autoIncrement?: boolean
  length?: number
  enumValues?: any[]

  is_reference(): boolean

  is_list(): boolean

  get_other_trellis(): Trellis

  get_path(): string
}

export interface Table {
  name: string
  isCross?: boolean
  indexes: Index[]
}

export interface Trellis {
  table: Table
  name: string
  properties: { [name: string]: Property }
  primary_keys: Property[]
  additional: any
  collection: any
  parent?: Trellis
  softDelete?: boolean

  get_identity(input: any): any

  get_lists(): any
}

export type TrellisMap = { [name: string]: Trellis }
export type TypeMap = { [name: string]: Type }

export interface Library {
  types: TypeMap
}

export interface Schema {
  trellises: TrellisMap
  library: Library
}