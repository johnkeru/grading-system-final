var EntitySchema = require("typeorm").EntitySchema

module.exports = new EntitySchema({
    name: "Role", // Will use table name `category` as default behaviour.
    tableName: "role", // Optional: Provide `tableName` property to override the default behaviour for table name.
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        role: {
            type: "varchar",
            
        },
        user_id: {
            type: "int",
        }
    }, 
    relations: {
        user: {
            target: "UserAuth",
            type: "many-to-one",
            joinTable: true,
            cascade: true,
            onDelete: "CASCADE"
        },
    },
})