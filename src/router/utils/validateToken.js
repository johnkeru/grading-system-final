const {verify} = require('jsonwebtoken')
const {access_token_secret, refresh_token_secret} = require('./secretToken')
const generateToken = require('./generateToken')
const {dataSource} = require('../../data-source')

async function validateToken(req, userOnly = false) {
    let id
    let personalEmail

    const {authorization} = req.headers
    if(authorization){
        try{
            if(authorization.split(' ')[0] !== 'Bearer') return {field: 'authorization', msg: 'Invalid token!'}
            const token = authorization.split(' ')[1]
            try{
                const user = verify(token, access_token_secret)
                id = user.id
                personalEmail = user.personalEmail
            }catch{
                const user = verify(token, refresh_token_secret)
                id = user.id
                personalEmail = user.personalEmail
            }
            const findUser = await dataSource.query('SELECT * FROM user_auth WHERE id = $1 AND "personalEmail" = $2', [id, personalEmail])
            if(findUser.length === 0) return {field: 'authorization', msg: 'Invalid token!'}
            if(userOnly) return findUser[0]
            return generateToken(findUser[0], true)
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