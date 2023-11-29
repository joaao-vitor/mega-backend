module.exports = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: 'OAuth2',
        clientId: process.env.MAIL_CLIENTID,
        clientSecret: process.env.MAIL_CLIENTSECRET,
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
        refreshToken: process.env.MAIL_REFRESHTOKEN,
    },
}
