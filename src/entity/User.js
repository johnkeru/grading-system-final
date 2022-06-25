var EntitySchema = require("typeorm").EntitySchema

module.exports = new EntitySchema({
    name: "UserAuth", // Will use table name `category` as default behaviour.
    tableName: "user_auth", // Optional: Provide `tableName` property to override the default behaviour for table name.
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        username: {
            type: "varchar",
        },
        personalEmail: {
            type: "varchar",
            unique: true,
        },
        approverLevel: {
            type: "int",
            default: 0,
        },
        schoolEmail: {
            type: "varchar",
            default: null
        },
        dateOfBirth: {
            type: "varchar",
            default: null
        },
        studentNumber: {
            type: "int",
            default: null
        },
        createdBy: {
            type: "int",
            default: 0,
        },
        createdOn: {
            type: "varchar",
            default: null
        },
        lastUpdatedBy: {
            type: "int",
            default: 0
        },
        lastUpdatedOn: {
            type: "varchar",
            default: null
        },
        inactive: {
            type: "boolean",
            default: false
        },
        reason: {
            type: "varchar",
            default: null
        },
        password: {
            type: "varchar",
        }
    },
})