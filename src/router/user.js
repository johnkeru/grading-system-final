const {Router} = require('express')
const checkAuthInput = require('./utils/checkAuthInput')
const checkRegisterInput = require('./utils/checkRegisterInput')
const validateToken = require('./utils/validateToken')
const {dataSource} = require('../data-source')
const checkAddUserInput = require('./utils/checkAddUserInput')
const checkUpdateUser = require('./utils/checkUpdateUser')
const router = Router()

router.post('/users/authenticate', async (req, res) => {
    const respo = await checkAuthInput(req)
    if(respo && respo.field) return res.json(respo)
    return res.json({access_token: respo})
})
router.post('/users/register', async (req, res) => {
    const respo = await checkRegisterInput(req)
    if(respo && respo.field) return res.json(respo)
    return res.json({access_token: respo})
})
router.get('/users/refresh', async (req, res) => {
    const respo = await validateToken(req)
    if(respo && respo.field) return res.json(respo)
    return res.json({refresh_token: respo})
})
router.get('/me', async (req, res) => {
    const respo = await validateToken(req, true)
    if(respo && respo.field) return res.json(respo)
    const {password, ...user} = respo
    const roles = await dataSource.query('SELECT * FROM role WHERE user_id = $1', [user.id])
    const data = Object.assign(user, {roles})
    return res.json({user: data})
})
router.post('/users/markInactive', async (req, res) => {
    const {inactive, reason, id} = req.body
    const respo = await dataSource.query('UPDATE user_auth SET inactive = $1, reason = $2 WHERE id = $3', [inactive, reason, id])
    return res.json(respo)
})
router.post('/users/approval', async (req, res) => {
    const {approve, id} = req.body
    
    const respo = await dataSource.query('UPDATE user_auth SET "approverLevel" = $1 WHERE id = $2', [approve, id])
    return res.json(respo)
})
router.post('/users/addUser', async (req, res) => {
    const respo = await checkAddUserInput(req)
        if(respo && respo.field) return res.json(respo)
    return res.json({user: respo})
})
router.put('/users/updateUser', async (req, res) => {
    const respo = await checkUpdateUser(req)
    if(respo && respo.field) return res.json(respo)
    return res.json({user: respo})
})
router.post('/users/getOneUser', async (req, res) => {
    const {id} = req.body || 0
    const respo = await dataSource.query('SELECT * FROM user_auth WHERE id = $1', [id])
    if(respo.length === 0) return res.json({ehhh: 'User not found'})
    const {password, ...user} = respo[0]
    const roles = await dataSource.query('SELECT * FROM role WHERE user_id = $1', [user.id])
    const data = Object.assign(user, {roles})
    return res.json({user: data})
})
router.post('/checkEmail', async (req, res) => {
    const {email} = req.body
    const respo = await dataSource.query('SELECT * FROM user_auth WHERE "personalEmail" = $1', [email])
    if(respo.length) return res.json({email})
    return res.json({
        field: 'email',
        msg: 'Email not found!'
    })
})
router.post('/changePassword', async (req, res) => {
    const {password, email} = req.body
    if(!password){
        return res.json({
            field: 'password',
            msg: 'Password is required!'
        })
    }
    if(password.length < 6){
        return res.json({
            field: 'password',
            msg: 'Password must be at least 6 characters!'
        })
    }
    const newPass = await dataSource.query('UPDATE user_auth SET password = $1 WHERE "personalEmail" = $2', [password, email]) 
    if(newPass) return res.json({success: true})
    return res.json({
        field: 'password',
        msg: 'Password not changed!'
    })
})
router.post('/getAllUsers', async (req, res) => {
    const limit = 10
    const limit_plus_one = Math.min(10, limit) + 1
    const cursor = req.body.cursor || 0
    let users = null;
    const getUser = async () => {
        if(cursor){
            return await dataSource.query(`SELECT * FROM user_auth WHERE id < $1 ORDER BY id DESC LIMIT $2`, [cursor, limit_plus_one])
        }else{
            return await dataSource.query(`SELECT * FROM user_auth ORDER BY id DESC LIMIT $1`, [limit_plus_one])
        }
    }
    users = await getUser()
    const data = Promise.all(
            users?.slice(0, limit).map(async(user) => {
            const roles = await dataSource.query('SELECT * FROM role WHERE user_id = $1', [user.id])
            return Object.assign(user, {roles})
        })
    )
    return res.json({
        users: await data,
        hasMore: users.length === limit_plus_one
    })
})
router.post('/getAllUsersApproversOnly', async (req, res) => {
    const limit = 10
    const limit_plus_one = Math.min(10, limit) + 1
    const cursor = req.body.cursor || 0
    let users = null;
    const getUser = async () => {
        if(cursor){
            return await dataSource.query(`SELECT * FROM user_auth WHERE "approverLevel" > 0 AND id < $1 ORDER BY id DESC LIMIT $2`, [cursor, limit_plus_one])
        }else{
            return await dataSource.query(`SELECT * FROM user_auth WHERE "approverLevel" > 0 ORDER BY id DESC LIMIT $1`, [limit_plus_one])
        }
    }
    users = await getUser()
    const data = Promise.all(
            users?.slice(0, limit).map(async(user) => {
            const roles = await dataSource.query('SELECT * FROM role WHERE user_id = $1', [user.id])
            return Object.assign(user, {roles})
        })
    )
    return res.json({
        users: await data,
        hasMore: users.length === limit_plus_one
    })
})
router.post('/getAllUsersApproversAscending', async (req, res) => {
    const limit = 10
    const limit_plus_one = Math.min(10, limit) + 1
    const cursor = req.body.cursor || 0
    let users = null;
    const getUser = async () => {
        if(cursor){
            return await dataSource.query(`SELECT * FROM user_auth WHERE "approverLevel" > 0 ORDER BY "approverLevel" ASC OFFSET $1 LIMIT $2`, [cursor, limit_plus_one])
        }else{
            return await dataSource.query(`SELECT * FROM user_auth WHERE "approverLevel" > 0 ORDER BY "approverLevel" ASC LIMIT $1`, [limit_plus_one])
        }
    }
    users = await getUser()
    const data = Promise.all(
            users?.slice(0, limit).map(async(user) => {
            const roles = await dataSource.query('SELECT * FROM role WHERE user_id = $1', [user.id])
            return Object.assign(user, {roles})
        })
    )
    return res.json({
        users: await data,
        hasMore: users.length === limit_plus_one
    })
})
router.post('/getAllUsersApproversDescending', async (req, res) => {
    const limit = 10
    const limit_plus_one = Math.min(10, limit) + 1
    const cursor = req.body.cursor || 0
    let users = null;
    const getUser = async () => {
        if(cursor){
            return await dataSource.query(`SELECT * FROM user_auth WHERE "approverLevel" > 0 ORDER BY "approverLevel" DESC OFFSET $1 LIMIT $2`, [cursor, limit_plus_one])
        }else{
            return await dataSource.query(`SELECT * FROM user_auth WHERE "approverLevel" > 0 ORDER BY "approverLevel" DESC LIMIT $1`, [limit_plus_one])
        }
    }
    users = await getUser()
    const data = Promise.all(
            users?.slice(0, limit).map(async(user) => {
            const roles = await dataSource.query('SELECT * FROM role WHERE user_id = $1', [user.id])
            return Object.assign(user, {roles})
        })
    )
    return res.json({
        users: await data,
        hasMore: users.length === limit_plus_one
    })
})
module.exports = router