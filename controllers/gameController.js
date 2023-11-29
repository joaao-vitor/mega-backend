const cloudinary = require('cloudinary').v2
const pool = require('../database')
const queries = require('../queries')
const fs = require('fs')

const addGame = async (req, res) => {
    const { nome, genero, descricao, data_lancamento, empresas, imgurl } =
        req.body

    try {
        const gameQuery = await pool.query(queries.addGame, [
            nome,
            genero,
            data_lancamento,
            descricao,
            imgurl,
        ])

        const game = gameQuery.rows[0]

        for (const emp of empresas) {
            await pool.query(queries.addEmpJogo, [emp, game.jogoid])
        }

        res.status(200).json({ ...game, empresas })
    } catch (error) {
        console.error('Erro durante a adição do jogo:', error)
        res.status(400).json({
            msg: error.message || 'Erro desconhecido durante a adição do jogo',
        })
    }
}

const removeGame = async (req, res) => {
    try {
        const { id } = req.params
        await pool.query(queries.delEmpGame, [id])
        await pool.query(queries.delGame, [id])

        res.status(200).json({ msg: 'Jogo excluído com sucesso!' })
    } catch (error) {
        res.status(400).json({ msg: error })
    }
}

const uploadProductImage = async (req, res) => {
    const result = await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        {
            use_filename: true,
            folder: 'file-upload',
        }
    )
    fs.unlinkSync(req.files.image.tempFilePath)
    return res.status(200).json({ image: { src: result.secure_url } })
}

const updateGame = async (req, res) => {
    const { id } = req.params
    const { nome, descricao, genero, data_lancamento, imgurl, empresas } = req.body
    try {
        const updateGameQuery = await pool.query(queries.updateGame, [nome, genero, data_lancamento, descricao, imgurl, id])
        const game = updateGameQuery.rows[0]

        await pool.query(queries.delEmpGame, [id])

        for (const emp of empresas) {
            await pool.query(queries.addEmpJogo, [emp, id])
        }
        res.status(200).json({ ...game, empresas })
    } catch (error) {
        console.log(error)
        res.status(400).json({ msg: error })
    }
}

const getGamebyId = async (req, res) => {
    const { id } = req.params
    try {
        const game = (await pool.query(queries.getGamebyId, [id])).rows[0]
        const empresas = (await pool.query(queries.getEmpsGame, [id])).rows

        game.empresas = empresas

        res.status(200).json({ ...game })
    } catch (error) {
        res.status(400).json({ msg: error })
    }
}

const latestGames = async (req, res) => {
    const games = (await pool.query(queries.latestGames)).rows
    for (const game of games) {
        const avg = parseInt((await pool.query(queries.getReviewAvg, [game.jogoid])).rows[0].media) || 0
        game.rating = avg
    }
    res.status(200).json([...games])
}

const futureGames = async (req, res) => {
    const games = (await pool.query(queries.futureGames)).rows
    for (const game of games) {
        game.rating = 0
    }
    res.status(200).json([...games])
}

const basedReviewGames = async (req, res) => {
    const { usuarioid } = req.user
    const games = (await pool.query(queries.basedReviewGames, [usuarioid])).rows
    for (const game of games) {
        const avg = parseInt((await pool.query(queries.getReviewAvg, [game.jogoid])).rows[0].media) || 0
        game.rating = avg
    }
    res.status(200).json([...games])
}

const getGameByName = async (req, res) => {
    const { nome } = req.query;
    const games = (await pool.query(queries.getGameByName, [`%${nome}%`])).rows

    for (const game of games) {
        const avg = parseInt((await pool.query(queries.getReviewAvg, [game.jogoid])).rows[0].media) || 0
        game.rating = avg
    }
    res.status(200).json(games);
};

const getHighlightGames = async (req, res) => {
    const games = (await pool.query(queries.getHighlightGames)).rows

    for (const game of games) {
        const avg = parseInt((await pool.query(queries.getReviewAvg, [game.jogoid])).rows[0].media) || 0
        game.rating = avg
    }
    res.status(200).json(games);

}
const highlightGame = async (req, res) => {
    const { id: jogoid } = req.params
    await pool.query(queries.highlightGame, [jogoid])
    res.status(200).json({ msg: "Jogo destacado com sucesso!" })
}

module.exports = {
    uploadProductImage,
    addGame,
    removeGame,
    updateGame,
    getGamebyId,
    latestGames,
    futureGames,
    basedReviewGames,
    getGameByName,
    getHighlightGames,
    highlightGame
}
