import {Property, Type_Category, Reference} from "./trellis"
import {Library} from "./loading"
import {Schema} from "./scheming"
import * as Sequelize from 'sequelize'

function get_field(property: Property, library: Library): any {
  const type = property.type
  if (type.get_category() == Type_Category.primitive) {
    if (type === library.types.int) {
      return {
        type: Sequelize.INTEGER,
        nullable: false
      }
    }

    if (type === library.types.string) {
      return {
        type: Sequelize.STRING,
        nullable: false
      }
    }

    if (type === library.types.json) {
      return {
        type: Sequelize.JSON,
        nullable: false
      }
    }


    if (type === library.types.bool) {
      return {
        type: Sequelize.BOOLEAN,
        nullable: false
      }
    }

    if (type === library.types.float) {
      return {
        type: Sequelize.FLOAT,
        nullable: false
      }
    }

    if (type === library.types.date) {
      return {
        type: Sequelize.DATE,
        nullable: false
      }
    }
  }
  else if (type.get_category() == Type_Category.list) {
    return null
  }
  else if (type.get_category() == Type_Category.trellis) {
    if (library.types[type.name]) {
      // return library.types [type.name]
      return null
    }
  }

  throw Error("Not implemented or supported")
}

export function vineyard_to_sequelize(schema: Schema, sequelize) {
  for (let name in schema.trellises) {
    const trellis = schema.trellises [name]
    const fields = {}
    for (let i in trellis.properties) {
      const field = get_field(trellis.properties[i], schema.library)
      if (field)
        fields[i] = field
    }

    trellis.table = sequelize.define(trellis.name, fields, {
      underscored: true,
      createdAt: 'created',
      updatedAt: 'modified',
    })
  }

  for (let name in schema.trellises) {
    const trellis = schema.trellises [name]
    for (let i in trellis.properties) {
      const property = trellis.properties [i]
      if (property.type.get_category() == Type_Category.trellis) {
        const reference = property as Reference
        // trellis.table.hasOne(reference.other_trellis.table)
      }
      else if (property.type.get_category() == Type_Category.list) {
        const list = property as Reference
        trellis.table.hasMany(list.get_other_trellis().table, {
          as: list.name,
          foreignKey: list.other_property.name
        })
      }
    }
  }
}

