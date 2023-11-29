const pool = require('../database');
const queries = require('../queries');

const deleteProgress = async (req, res) => {
    const { usuarioid } = req.user
    const results = await pool.query(queries.deleteProgress, [usuarioid])
    res.status(200).json({ msg: "Ação realizada com sucesso!" })
}
const addProgress = async (req, res) => {


    const { usuarioid } = req.user
    const { jogoid, progressoid } = req.body

    await pool.query(queries.deleteProgress, [usuarioid, jogoid])
    const results = await pool.query(queries.addProgress, [usuarioid, progressoid, jogoid])
    res.status(200).json({ msg: "Ação realizada com sucesso!" })
}
module.exports = {
    addProgress,
    deleteProgress
}