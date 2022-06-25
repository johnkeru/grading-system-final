const {verify} = require('jsonwebtoken')
const {access_token_secret, refresh_token_secret} = require('./secretToken')
const generateToken = require('./generateToken')
const {dataSource} = require('../../data-source')

async function validateToken(req, userOnly = false) {
    let user_id
    let email

    const {authorization} = req.headers
    if(authorization){
        try{
            if(authorization.split(' ')[0] !== 'Bearer') return {field: 'authorization', msg: 'Invalid token!'}
            const token = authorization.split(' ')[1]
            try{
                const user = verify(token, access_token_secret)
                user_id = user.user_id
                email = user.email
            }catch{
                const user = verify(token, refresh_token_secret)
                user_id = user.user_id
                email = user.email
            }
            const findUser = await dataSource.query('SELECT * FROM user_auth WHERE user_id = $1 AND email = $2', [user_id, email])
            if(findUser.rowCount === 0) return {field: 'authorization', msg: 'Invalid token!'}
            if(userOnly) return findUser.rows[0]
            return generateToken(findUser.rows[0], true)
        }
        catch{
            return {
                field: 'access_token',
                msg: 'Invalid access_token!'
            }
        }
    }else{
        return {
            field: 'access_token',
            msg: 'Invalid access_token!'
        }
    }
}

module.exports = validateToken