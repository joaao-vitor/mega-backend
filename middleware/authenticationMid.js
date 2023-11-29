const { isTokenValid } = require('../utils/jwt')
const { attachCookiesToResponse } = require('../utils/jwt')
const pool = require('../database')
const authenticateUser = async (req, res, next) => {
    const { refreshToken, accessToken } = req.signedCookies

    try {
        if (accessToken) {
            const payload = isTokenValid(accessToken)
            req.user = payload.user
            return next()
        }
        const payload = isTokenValid(refreshToken)

        const tokenQuery =
            'SELECT * from Token WHERE usuarioid = $1 and refreshToken = $2'
        const existingToken = await pool.query(tokenQuery, [
            payload.user.usuarioid,
            payload.refreshToken,
        ])?.rows[0]

        if (!existingToken || !existingToken?.isValid) {
            return res.status(400).json({ msg: 'Autenticação inválida! 1' })
        }

        attachCookiesToResponse({
            res,
            user: payload.user,
            refreshToken: existingToken.refreshtoken,
        })

        req.user = payload.user
        next()
    } catch (error) {
        return res.status(400).json({ msg: 'Autenticação inválida!', error })
    }
}

module.exports = {
    authenticateUser,
}
