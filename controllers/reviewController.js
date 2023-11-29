const pool = require('../database');
const queries = require('../queries');

const getReviewAvg = async (req, res) => {
    const { id } = req.params
    const results = (await pool.query(queries.getReviewAvg, [id])).rows[0]

    res.status(200).json(results)
}

const getReviewsByGame = async (req, res) => {
    const { id } = req.params
    const results = (await pool.query(queries.getReviewsByGame, [id])).rows

    res.status(200).json(results)
}

const addReview = async (req, res) => {
    const { descricao, classificacao, jogoid } = req.body
    const { usuarioid } = req.user
    const data = new Date()
    if ((await pool.query(queries.getRateByUserId, [usuarioid])).rowCount > 0) {
        return res.status(400).json({ msg: "Você já possui uma avaliação!" })
    }
    pool.query(queries.addRate, [usuarioid, descricao, classificacao, jogoid, data], (error, results) => {
        if (error) throw error;
        res.status(201).json({ msg: "Avaliação inserida com sucesso" });
    }
    )
}

const delReview = async (req, res) => {
    const { id } = req.params
    const { usuarioid } = req.user

    const review = (await pool.query(queries.getRateById, [id])).rows[0]
    if (review.usuarioid !== usuarioid)
        return res.status(401).json({ msg: "Essa review não é sua!" })
    if (!review)
        return res.status(400).json({ msg: "Review não encontrada" })
    await pool.query(queries.delReview, [id])
    return res.status(200).json({ msg: "Review deletada" })


}
module.exports = {
    getReviewAvg,
    getReviewsByGame,
    addReview,
    delReview
}