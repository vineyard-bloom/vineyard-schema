import {Types, Primitive} from "./types"

export type Type_Map = {[name: string]: Types}

export class LibraryImplementation {
  types: Type_Map

  constructor() {
    this.types = {
      Long: new Primitive('Long'),
      BigNumber: new Primitive('BigNumber'),
      Bool: new Primitive('Bool'),
      Date: new Primitive('Date'),
      Datetime: new Primitive('Datetime'),
      Float: new Primitive('Float'),
      Int: new Primitive('Int'),
      Json: new Primitive('Json'),
      Short: new Primitive('Short'),
      String: new Primitive('String'),
      Time: new Primitive('Time'),
      Text: new Primitive('Text'),
      Uuid: new Primitive('Uuid'),
    }
  }

  add_type(type: Types) {
    if (this.types[type.name])
      throw new Error('LibraryImplementation already has a type named ' + type.name + '.')

    this.types [type.name] = type
  }
}
