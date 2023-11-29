
const pool = require('../database')
const queries = require('../queries')

const showMe = async (req, res) => {
    res.status(200).json({ user: req.user })
}
const getUser = async (req, res) => {
    const { id } = req.params
    const user = (await pool.query(queries.getUserById, [id])).rows[0]
    if (!user) return res.status(400).json({ msg: "Usuário não encontrado" })
    const following = (await pool.query(queries.getFollowing, [id])).rows[0]
    const followers = (await pool.query(queries.getFollowers, [id])).rows[0]

    const reviewCount = (await pool.query(queries.getReviewCountUser, [id])).rows[0].count
    const abandonedCount = (await pool.query(queries.getAbandonedUser, [id])).rows[0].count
    const playingCount = (await pool.query(queries.getPlayingUser, [id])).rows[0].count
    const completedCount = (await pool.query(queries.getCompletedUser, [id])).rows[0].count

    user.reviewCount = reviewCount
    user.abandonadosCount = abandonedCount
    user.jogandoCount = playingCount
    user.completadosCount = completedCount
    user.seguindo = following.count
    user.seguidores = followers.count

    res.status(200).json(user)
}

const getLastUserReviews = async (req, res) => {
    const { id } = req.params
    const reviews = (await pool.query(queries.getLastUserReviews, [id])).rows

    res.status(200).json(reviews)
}

const followUser = async (req, res) => {
    const { usuarioid } = req.user
    const { id } = req.params
    try {
        await pool.query(queries.followUser, [usuarioid, id])
    } catch (error) {
        res.status(400).json(error)
    }
    res.status(200).json({ msg: "Usuario seguido com sucesso!" })
}
const unfollowUser = async (req, res) => {
    const { usuarioid } = req.user
    const { id } = req.params
    try {
        await pool.query(queries.unfollowUser, [usuarioid, id])
    } catch (error) {
        res.status(400).json(error)
    }
    res.status(200).json({ msg: "Você parou de seguir esse usuário!" })
}

const doFollow = async (req, res) => {
    const { usuarioid } = req.user
    const { id } = req.params

    const results = (await pool.query(queries.doFollow, [usuarioid, id])).rowCount > 0
    res.status(200).json({ follow: results })
}

const updateUser = async (req, res) => {
    const { usuarioid } = req.user
    const { nome, cidade, estado, data_nascimento, imgurl } = req.body
    const user = (await pool.query(queries.getUserById, [usuarioid])).rows[0]

    if (!user) return res.status(400).json({ msg: "Usuário não existe" })

    await pool.query(queries.updateUser, [nome || user.nome, cidade || user.cidade, estado || user.estado, data_nascimento || user.data_nascimento, imgurl || user.imgurl, usuarioid])

    res.status(200).json({ msg: "Usuário atualizado com sucesso!" })
}
module.exports = {
    showMe,
    getUser,
    followUser,
    doFollow,
    unfollowUser,
    getLastUserReviews,
    updateUser
}
