const {sign} = require('jsonwebtoken');
const {access_token_secret, refresh_token_secret} = require('./secretToken')

const generateToken = (user, isRefreshToken) => {
    const isR = isRefreshToken
    return sign({
        id: user.id,
        personalEmail: user.personalEmail,
        username: user.username,
    }, isR ? refresh_token_secret : access_token_secret, {
        expiresIn: isR ? '7d' : '1h'
    })
}

module.exports = generateToken