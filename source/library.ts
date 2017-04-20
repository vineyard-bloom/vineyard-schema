import {Type, Primitive} from "./type"

export type Type_Map = {[name: string]: Type}

export class Library {
  types: Type_Map

  constructor() {
    const guid = new Primitive('guid')

    this.types = {
      long: new Primitive('long'),
      bool: new Primitive('bool'),
      date: new Primitive('date'),
      datetime: new Primitive('datetime'),
      float: new Primitive('float'),
      guid: guid,
      uuid: guid,
      json: new Primitive('json'),
      int: new Primitive('int'),
      string: new Primitive('string'),
      time: new Primitive('time'),
    }
  }

  add_type(type: Type) {
    if (this.types[type.name])
      throw new Error('Library already has a type named ' + type.name + '.')

    this.types [type.name] = type
  }
}
