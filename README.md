# Vineyard Schema

## Defining a Schema
```
import * as scheming from 'vineyard-schema'

const schema = new scheming.Schema({
        
    Character: {
        properties: {
            name: {
                type: "string"
            },
            items: {
                type: "list",
                trellis: "Item"
            },
        }
    },
    
    Item: {
        properties: {
            name: {
                type: "string"
            },
            character: {
                type: "Character",
            },
        }
    },
        
        
```

## Applying a Schema to Sequelize

```
const db = new sequelize(config.database)
vineyard_schema.vineyard_to_sequelize(schema, db)
```