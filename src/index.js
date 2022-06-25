const { dataSource } = require("./data-source");
const express = require('express')
const app = express()
const router = require('./router/user')
const role_router = require('./router/role')
const routerRoleList = require('./router/roleList')
const cors = require('cors')

dataSource.initialize().then(async () => {
    app.use(express.json())
    app.use(cors({origin: 'http://localhost:3000'}))
    app.use(router)
    app.use(role_router)
    app.use(routerRoleList)
    app.listen(5000, () => console.log('Example app listening on port 5000! 🚀🚀'))
}).catch(error => console.log(error))
