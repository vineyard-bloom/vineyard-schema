import {LibraryImplementation} from './library'
import {load_schema} from './loading'
import {Schema, TrellisMap, Types} from './types'

export function newSchema(definitions: any): Schema {
  const schema = {
    trellises: {},
    library: new LibraryImplementation()
  }

  load_schema(definitions, schema.trellises, schema.library)

  return schema
}