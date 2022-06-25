const {dataSource} = require('../../data-source')

async function checkUpdateUser(req){
    const { username, schoolEmail, dateOfBirth, lastUpdatedOn, lastUpdatedBy, id } = req.body

    if(!username){
        return {
            field: 'username',
            msg: 'Username is required!'
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
    if(!dateOfBirth){
        return {
            field: 'dateOfBirth',
            msg: 'Date of birth is required!'
        }
    }

    const updateUser = await dataSource.query(`
        UPDATE user_auth 
        SET username = $1, "schoolEmail" = $2, "dateOfBirth" = $3, "lastUpdatedOn" = $4, "lastUpdatedBy" = $5
        WHERE id = $6 RETURNING *`,
        [username, schoolEmail, dateOfBirth, lastUpdatedOn, lastUpdatedBy, id])
    return updateUser[0]
}
module.exports = checkUpdateUser
