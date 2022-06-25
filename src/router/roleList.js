const {Router} = require('express');
const routerRoleList = Router();
const {dataSource} = require('../data-source')

routerRoleList.get('/role-lists', async (_, res) => {
    const roleLists = await dataSource.query('SELECT * FROM role_list')
    return res.json(roleLists)
})
routerRoleList.post('/add-role', async (req, res) => {
    const {role_name} = req.body
    const roleList = await dataSource.query('INSERT INTO role_list (role_name) VALUES ($1)', [role_name])
    return res.json(roleList)
})
module.exports = routerRoleList;
