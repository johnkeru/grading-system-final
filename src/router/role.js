const {Router} = require('express')
const {dataSource} = require('../data-source')

const role_router = Router()

role_router.post('/addRole', async (req, res) => {
    const {role:rol, user_id} = req.body
    if(!rol){ 
        return res.json({
            field: 'role',
            msg: 'Role name is required!'
        })
    }
    const role = await dataSource.query('INSERT INTO role (role, user_id) VALUES ($1, $2) RETURNING *', [rol, user_id])
    return res.json({role})
})

role_router.delete('/deleteRole', async (req, res) => {
    const {id} = req.body
    const role = await dataSource.query('DELETE FROM role WHERE id = $1 RETURNING *', [id])
    return res.json({role})
})

module.exports = role_router