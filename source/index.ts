import * as lawn from 'vineyard-lawn'
import {Method, HTTP_Error, Bad_Request} from 'vineyard-lawn'
import * as scheming from './scheming'
import {apply_schema} from "./apply_schema"
export {scheming}

export function initialize(schema, db) {
  // const definitions = scheming.get_definitions(bushel.schema)
  // const models = vineyard_mongoose.define_schema(definitions)
  apply_schema(schema, db)
}