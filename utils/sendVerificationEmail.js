const sendEmail = require('./sendEmail')

const sendVerificationEmail = async ({
    name,
    email,
    verificationToken,
    origin,
}) => {
    const verifyEmail = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`

    const message = `<p>Confirme o seu email clicando no link abaixo: 
  <a href="${verifyEmail}">Verificar Email</a> </p>`

    return sendEmail({
        to: email,
        subject: 'Confirmação do email',
        html: `<h4> Olá, ${name}</h4>
    ${message}
    `,
    })
}

module.exports = sendVerificationEmail
