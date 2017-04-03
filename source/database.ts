import {Property, Type_Category, Reference, Trellis_Type, Trellis} from "./trellis"
import {Library} from "./library"
import {Schema} from "./scheming"
import * as Sequelize from 'sequelize'

function get_field(property: Property, library: Library): any {
  const type = property.type
  if (type.get_category() == Type_Category.primitive) {
    if (type === library.types.int) {
      return {
        type: Sequelize.INTEGER
      }
    }

    if (type === library.types.string) {
      return {
        type: Sequelize.STRING
      }
    }

    if (type === library.types.json) {
      return {
        type: Sequelize.JSON
      }
    }

    if (type === library.types.bool) {
      return {
        type: Sequelize.BOOLEAN
      }
    }

    if (type === library.types.guid) {
      return {
        type: Sequelize.UUID
      }
    }

    if (type === library.types.float) {
      return {
        type: Sequelize.FLOAT
      }
    }

    if (type === library.types.date) {
      return {
        type: Sequelize.DATE
      }
    }
  }
  else if (type.get_category() == Type_Category.list) {
    return null
  }
  else if (type.get_category() == Type_Category.trellis) {
    if (library.types[type.name]) {
      return get_field((type as Trellis_Type).trellis.primary_key, library)
    }
  }

  throw Error("Not implemented or supported")
}

function create_field(property: Property, library: Library): any {
  const field = get_field(property, library)
  if (field) {
    field.allowNull = property.nullable
  }

  return field
}
function convert_relationship(property: Property, trellis: Trellis){
  if (property.type.get_category() == Type_Category.trellis) {
    const reference = property as Reference
    if (!reference.other_property)
      trellis.table.belongsTo(reference.get_other_trellis().table, {foreignKey: reference.name, constraints: false})
  }
  else if (property.type.get_category() == Type_Category.list) {
    const list = property as Reference
    trellis.table.hasMany(list.get_other_trellis().table, {
      as: list.name,
      foreignKey: list.other_property.name,
      constraints: false
    })
  }
}

export function vineyard_to_sequelize(schema: Schema, sequelize) {
  for (let name in schema.trellises) {
    const trellis = schema.trellises [name]
    const fields = {}

    // Create the primary key field first for DB UX
    const primary_key = fields[trellis.primary_key.name] = create_field(trellis.primary_key, schema.library)
    primary_key.primaryKey = true

    for (let i in trellis.properties) {
      if (i == trellis.primary_key.name)
        continue

      const property = trellis.properties[i]
      const field = create_field(property, schema.library)
      if (field) {
        fields[i] = field
      }
    }

    trellis.table = sequelize.define(trellis.name, fields, {
      underscored: true,
      createdAt: 'created',
      updatedAt: 'modified',
      freezeTableName: true
    })
  }

  for (let name in schema.trellises) {
    const trellis = schema.trellises [name]
    for (let i in trellis.properties) {
      const property = trellis.properties [i]
      convert_relationship(property, trellis)
    }
  }
}