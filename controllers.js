const pool = require('./database');
const queries = require('./queries');

//Exibe os usuários
const getUser = (req, res) => {
    pool.query(queries.getUser, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
};

const getEmpresa = (req, res) => {
    pool.query(queries.getEmpresa, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
};


// Exibe as avaliações
const getRate = (req, res) => {
    pool.query(queries.getRate, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
};

// Exibe os jogos
const getGame = async (req, res) => {
    const gamesQuery = await pool.query(queries.getGame)
    let games = gamesQuery.rows
    if (games) {
        for (game of games) {
            const { jogoid } = game

            const empsQuery = await pool.query(queries.getEmpsGame, [jogoid])
            const emps = empsQuery.rows
            game.empresas = [...emps]
        }
        return res.status(200).json(games)
    }
    res.status(404).json({ msg: 'Nenhum jogo encontrado' })
}

const getGroup = (req, res) => {
    pool.query(queries.getGroup, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
};

const getAdvance = (req, res) => {
    pool.query(queries.getAdvance, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
};
const getById = async (req, res) => {
    const id = parseInt(req.params.id);
    const game = (await pool.query(queries.getById, [id])).rows[0]
    if (!game) return res.status(404).json({ msg: 'Jogo não encontrado' })

    const { jogoid } = game

    const empsQuery = await pool.query(queries.getEmpsGame, [jogoid])
    const emps = empsQuery.rows
    game.empresas = [...emps]
    res.status(200).json(game);
};

const addUser = (req, res) => {
    const { nome, email, senha, cidade, estado, data_nascimento, administrador, contato } = req.body;

    pool.query(queries.checkEmail, [email], (error, results) => {
        if (results.rows.length) {
            res.json({ msg: "Email já existe." });
        }

        else {
            pool.query(queries.addUser, [nome, email, senha, cidade, estado, data_nascimento, administrador, contato], (error, results) => {
                if (error) throw error;
                res.status(201).json({ msg: "Usuário inserido com sucesso" });
            });
        };
    });
};
//As chaves estrangeiras usuarioID e jogoID, estao dando nulas ao serem adicionadas
const addRate = (req, res) => {
    const { usuarioID, descricao, classificacao, jogoID } = req.body;

    pool.query(queries.addRate, [usuarioID, descricao, classificacao, jogoID], (error, results) => {
        if (error) throw error;
        res.status(201).json({ msg: "Avaliação inserida com sucesso" });
    }
    );
};

const addGroup = (req, res) => {
    const { usuarioID, nome } = req.body;

    pool.query(queries.addGroup, [usuarioID, nome], (error, results) => {
        if (error) throw error;
        res.status(201).json({ msg: "Grupo inserido com sucesso" });
    }
    );
};

const addCompany = (req, res) => {
    const { descricao, nome, contato } = req.body;
    pool.query(queries.addCompany, [descricao, nome, contato], (error, results) => {
        if (error) throw error;
        res.status(201).json({ msg: "Empresa inserida com sucesso" });
    }
    );
};

const getRateById = (req, res) => {
    const iduser = parseInt(req.params.iduser);
    pool.query(queries.getRateById, [iduser], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
};

module.exports = {
    getUser,
    getById,
    getRate,
    getGroup,
    getAdvance,
    addUser,
    addRate,
    addGroup,
    addCompany,
    getGame,
    getRateById,
    getEmpresa
};