const generateToken = require('./generateToken')
const {dataSource} = require('../../data-source')

async function checkRegisterInput(req){
    const {username, personalEmail, password} = req.body
    if(!username){
        return {
            field: 'username',
            msg: 'Username is required'
        }
    }
    if(username.length < 3){
        return {
            field: 'username',
            msg: 'Username must be at least 3 characters'
        }
    }
    if(username.includes('@')){
        return {
            field: 'username',
            msg: 'Username cannot contain @'
        }
    }
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
    const findUser = await dataSource.query('SELECT * FROM user_auth WHERE "personalEmail" = $1', [personalEmail])
    if(findUser.length !== 0){
        return {
            field: 'personalEmail',
            msg: 'personal email already exists.'
        }
    }
    const insertUser = await dataSource.query('INSERT INTO user_auth (username, "personalEmail", password) VALUES ($1, $2, $3) RETURNING *',
        [username, personalEmail, password])

    const ADMINS = ['macatangaylycap@gmail.com', 'admin@gmail.com', 'isaacbambico@gmail.com', 'bernardalbayteves@gmail.com', process.env.ADMIN_personalEmail]

    const role = ADMINS.includes(personalEmail) ? 'admin' : 'standard'
    const insertRole = {
        role,
        user_id: insertUser[0].id,
        user: insertUser[0]
    }
    const roleRepository = dataSource.getRepository('role')
    await roleRepository.save(insertRole)

    return generateToken(insertUser[0], false)
}
module.exports = checkRegisterInput
