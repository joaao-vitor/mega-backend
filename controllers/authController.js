const pool = require('../database')
const queries = require('../queries')

const crypto = require('crypto')
const bcrypt = require('bcrypt')

const sendVerificationEmail = require('../utils/sendVerificationEmail')
const createTokenUser = require('../utils/createUserToken')
const { attachCookiesToResponse } = require('../utils/jwt')

const register = async (req, res) => {
    const { email, password, confirmPassword, name } = req.body

    if (!email || !password || !confirmPassword || !name)
        return res.status(400).json({ msg: 'Preencha todos os campos!' })

    if (password !== confirmPassword)
        return res
            .status(400)
            .json({ msg: 'As senhas não estão correspondendo' })

    const response = await pool.query(queries.checkEmail, [email])
    if (response.rows.length)
        return res.status(400).json({ msg: 'Email já existe.' })

    const salt = await bcrypt.genSalt(10)
    const newPassword = await bcrypt.hash(password, salt)

    const firstAccountQuery = await pool.query(
        'SELECT COUNT(*) as userCount from usuario'
    )

    const adminBool = firstAccountQuery.rows[0].usercount <= 0

    const verificationToken = crypto.randomBytes(40).toString('hex')

    const userQuery =
        'INSERT INTO usuario (nome, email, senha, administrador, verificationToken) VALUES ($1,$2,$3,$4,$5)'

    await pool.query(userQuery, [
        name,
        email,
        newPassword,
        adminBool,
        verificationToken,
    ])

    await sendVerificationEmail({
        name,
        email,
        verificationToken,
        origin: process.env.ORIGIN,
    })
    res.status(201).json({
        msg: 'Sucesso! Verifique sua conta para verificar o seu email!',
    })
}
const verifyEmail = async (req, res) => {
    const { verificationToken, email } = req.body
    const resposta = await pool.query(
        `SELECT * FROM Usuario WHERE email = $1`,
        [email]
    )
    if (resposta.rows.length <= 0)
        return res.status(400).json({ msg: 'Verificação com erro email!' })

    const user = resposta.rows[0]

    if (verificationToken !== user.verificationtoken)
        return res.status(401).json({ msg: 'Verificação com erro!' })

    await pool.query(
        'UPDATE Usuario SET isverified = $1, verificationtoken = $2 WHERE usuarioid = $3',
        [true, '', user.usuarioid]
    )

    res.status(201).json({ msg: 'Email verificado' })
}
const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ msg: 'Credenciais Inválidas1' })
    }
    const resposta = await pool.query(
        `SELECT * FROM Usuario WHERE email = $1`,
        [email]
    )
    if (resposta.rows.length <= 0)
        return res.status(400).json({ msg: 'Verificação com erro email!' })

    const user = resposta.rows[0]
    const isPasswordCorrect = await bcrypt.compare(password, user.senha)

    if (!isPasswordCorrect)
        return res.status(400).json({ msg: 'Credenciais Inválidas2' })
    if (!user.isverified)
        return res.status(400).json({ msg: 'Verifique seu email' })

    const tokenUser = createTokenUser(user)

    let refreshToken = ''

    const tokenQuery = 'SELECT * from Token Where usuarioid = $1'
    const resToken = await pool.query(tokenQuery, [tokenUser.userId])
    const existingToken = resToken?.rows[0]

    if (existingToken) {
        const { isvalid } = existingToken
        if (!isvalid) {
            return res.status(400).json({ msg: 'Credenciais Inválidas3' })
        }

        refreshToken = existingToken.refreshToken
        attachCookiesToResponse({ res, user: tokenUser, refreshToken })
        res.status(200).json({ user: tokenUser })
    } else {
        refreshToken = crypto.randomBytes(40).toString('hex')
        const userAgent = req.headers['user-agent']
        const ip = req.ip
        const userToken = { refreshToken, ip, userAgent, user: user.usuarioid }

        const createTokenQuery = 'INSERT INTO token (refreshToken, ip, userAgent, usuarioid) values ($1, $2, $3, $4)'
        const resCreateToken = pool.query(createTokenQuery, [refreshToken, ip, userAgent, user.usuarioid])

        attachCookiesToResponse({ res, user: tokenUser, refreshToken })

        res.status(200).json({ user: tokenUser })
    }
}

const logout = async (req, res) => {
    const deleteTokenQuery = 'DELETE from Token Where usuarioid = $1'
    const resDel = pool.query(deleteTokenQuery, [req.user.usuarioid])

    res.cookie('accessToken', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now()),
    })
    res.cookie('refreshToken', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now()),
    })
    res.status(201).json({ msg: 'Usuário saiu!' })
}

module.exports = {
    register,
    verifyEmail,
    login,
    logout
}
