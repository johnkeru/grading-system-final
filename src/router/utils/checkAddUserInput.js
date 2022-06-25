const {dataSource} = require('../../data-source')

async function checkAddUserInput(req){
    const {username, personalEmail, schoolEmail, dateOfBirth, studentNumber, createdBy, createdOn, password} = req.body
    if(!username){
        return {
            field: 'username',
            msg: 'Username is required!'
        }
    }
    if(!personalEmail){
        return {
            field: 'personalEmail',
            msg: 'Personal email is required!'
        }
    }
    if(!schoolEmail){
        return {
            field: 'schoolEmail',
            msg: 'School email is required!'
        }
    }
    if(!dateOfBirth){
        return {
            field: 'dateOfBirth',
            msg: 'Date of birth is required!'
        }
    }
    if(!studentNumber){
        return {
            field: 'studentNumber',
            msg: 'Student number is required!'
        }
    }
    if(!password){
        return {
            field: 'password',
            msg: 'Password is required!'
        }
    }
    if(username.length < 6){
        return {
            field: 'username',
            msg: 'Username must be at least 6 characters!'
        }
    }
    if(username.length > 54){
        return {
            field: 'username',
            msg: 'Username must be less than 54 characters!'
        }
    }
    if(personalEmail.length < 6){
        return {
            field: 'personalEmail',
            msg: 'Personal email must be at least 6 characters!'
        }
    }
    if(!personalEmail.includes('@')){
        return {
            field: 'personalEmail',
            msg: 'Personal email must include "@"!'
        }
    }
    if(schoolEmail.length < 6){
        return {
            field: 'schoolEmail',
            msg: 'School email must be at least 6 characters!'
        }
    }
    if(!schoolEmail.includes('@')){
        return {
            field: 'schoolEmail',
            msg: 'School email must include "@"!'
        }
    }
    if(personalEmail === schoolEmail){
        return {
            field: 'schoolEmail',
            msg: 'Personal email and school email must be different!'
        }
    }
    if(!dateOfBirth){
        return {
            field: 'dateOfBirth',
            msg: 'Date of birth is required!'
        }
    }
    const findUser = await dataSource.query('SELECT * FROM user_auth WHERE "personalEmail" = $1', [personalEmail])
    if(findUser.length !== 0){
        return {
            field: 'personalEmail',
            msg: 'personal email already exists.'
        }
    }
    const user = await dataSource.query(`
        INSERT INTO user_auth (username, "personalEmail", "schoolEmail", "dateOfBirth", "studentNumber", "createdBy", "createdOn", password) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`, 
        [username, personalEmail, schoolEmail, dateOfBirth, studentNumber, createdBy, createdOn, password])
    
    const insertRole = {
        role: 'guest',
        user_id: user[0].id,
        user: user[0]
    }
    const roleRepository = dataSource.getRepository('role')
    await roleRepository.save(insertRole)

    return user[0]
}
module.exports = checkAddUserInput
