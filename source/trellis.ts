export enum Type_Category {
  incomplete,
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

  constructor(name: string, trellis: Trellis) {
    super(name)
    this.trellis = trellis
  }

  get_category(): Type_Category {
    return Type_Category.trellis
  }
}

export class List_Type extends Type {
  child_type: Type

  constructor(name: string, child_type: Type) {
    super(name)
    this.child_type =  child_type
  }

  get_category(): Type_Category {
    return Type_Category.list
  }
}

export class Incomplete_Type extends Type {
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

  is_reference(): boolean {
    return this.type.get_category() == Type_Category.trellis || this.type.get_category() == Type_Category.list
  }
}

export class Reference extends Property {
  other_property: Property

  constructor(name: string, type: Type, trellis: Trellis, other_property: Property) {
    super(name, type, trellis)
    this.other_property = other_property
  }

  get_other_trellis(): Trellis {
    return this.type.get_category() == Type_Category.trellis
      ? (this.type as Trellis_Type).trellis
      : ((this.type as List_Type).child_type as Trellis_Type).trellis
  }
}

export class Trellis {
  name: string
  properties: {[name: string]: Property} = {}
  table

  constructor(name: string) {
    this.name = name
  }
}
