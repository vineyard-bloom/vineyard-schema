import {Primitive} from "./trellis"

export class Library {
  types

  constructor() {
    const guid = new Primitive('guid')
    this.types = {
      bool: new Primitive('bool'),
      date: new Primitive('date'),
      float: new Primitive('float'),
      guid: guid,
      uuid: guid,
      json: new Primitive('json'),
      int: new Primitive('int'),
      string: new Primitive('string'),
    }
  }
}
