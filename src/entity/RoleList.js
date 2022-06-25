var EntitySchema = require("typeorm").EntitySchema

module.exports = new EntitySchema({
    name: "RoleList", // Will use table name `category` as default behaviour.
    tableName: "role_list", // Optional: Provide `tableName` property to override the default behaviour for table name.
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        role_name: {
            type: "varchar",
        }
    }
})