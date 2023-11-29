const createTokenUser = (user) => {
    return { nome: user.nome, usuarioid: user.usuarioid, isAdmin: user.administrador, imgurl: user.imgurl }
}

module.exports = createTokenUser
