import {Primitive} from "./trellis"

export class Library {
  types

  constructor() {
    this.types = {
      bool: new Primitive('bool'),
      date: new Primitive('date'),
      float: new Primitive('float'),
      guid: new Primitive('guid'),
      json: new Primitive('json'),
      int: new Primitive('int'),
      string: new Primitive('string'),
    }
  }
}
