const generateToken = require('./generateToken')
const {dataSource} = require('../../data-source')

async function checkAuthInput(req){
    const {personalEmail, password} = req.body
    if(!personalEmail){
        return {
            field: 'personalEmail',
            msg: 'Please enter your personal email.'
        }
    }
    if(!personalEmail.includes('@')){
        return {
            field: 'personalEmail',
            msg: 'Please enter a valid personal email.'
        }
    }
    if(personalEmail.length < 4){
        return {
            field: 'personalEmail',
            msg: 'Please enter a valid personal email.'
        }
    }
    if(!password){
        return {
            field: 'password',
            msg: 'Please enter your password.'
        }
    }
    if(password.length < 4){
        return {
            field: 'password',
            msg: 'Password must be at least 5 characters.'
        }
    }
    const user = await dataSource.query('SELECT * FROM user_auth WHERE "personalEmail" = $1', [personalEmail])
    if(!user[0]){
        return {
            field: 'personalEmail',
            msg: 'personal email not found.'
        }
    }
    if(user[0].password !== password){
        return {
            field: 'password',
            msg: 'Password is incorrect.'
        }
    }
    return generateToken(user[0], false)
}

module.exports = checkAuthInput
