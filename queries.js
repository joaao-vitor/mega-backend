const getUser = "SELECT * FROM usuario";
const getEmpresa = "SELECT * FROM empresa";
const getGame = "SELECT * FROM jogo";
const getEmpsGame = "select ej.empresaid, nome, descricao, contato from empresa_jogo as ej join empresa as e on ej.empresaId = e.empresaId where ej.jogoid = $1";
const getGameByName = "SELECT * FROM jogo WHERE nome LIKE $1";
const getById = "SELECT * FROM jogo WHERE jogoID = $1";
const getRateByUserId = "SELECT * FROM avaliacao WHERE usuarioID = $1 and jogoid = $2";
const getRate = "SELECT * FROM avaliacao";
const getGroup = "SELECT * FROM grupo";
const getAdvance = "SELECT * FROM progressojogo";
const addUser = "INSERT INTO usuario (nome, email, senha, cidade, estado, data_nascimento, administrador, contato) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)";
const addRate = "INSERT INTO avaliacao (usuarioID, descricao, classificacao, jogoID, data) VALUES ($1,$2,$3,$4,$5)";
const addGroup = "INSERT INTO grupo (usuarioID,nome) VALUES ($1,$2)";
const addCompany = "INSERT INTO empresa (descricao, nome, contato) VALUES ($1,$2,$3)";
const checkEmail = "SELECT s FROM usuario s WHERE s.email = $1";

const addGame = "INSERT INTO jogo (nome,genero, data_lancamento, descricao, imgurl) VALUES ($1, $2, $3, $4, $5) RETURNING *"
const addEmpJogo = "INSERT INTO empresa_jogo (empresaid, jogoid) VALUES ($1, $2) RETURNING *"

const delGame = "DELETE FROM jogo WHERE jogoid = $1"
const delEmpGame = "DELETE FROM empresa_jogo WHERE jogoid = $1"

const updateGame = "UPDATE jogo SET nome = $1, genero = $2, data_lancamento = $3, descricao = $4, imgurl = $5 WHERE jogoid = $6 RETURNING *"
const highlightGame = "UPDATE jogo SET destaque = not destaque WHERE jogoid = $1"
const getHighlightGames = "SELECT * from jogo WHERE destaque = true"

const getGamebyId = "SELECT * from jogo where jogoid = $1"

const getReviewAvg = "SELECT avg(classificacao) as media from avaliacao where jogoid = $1"
const getReviewsByGame = "SELECT avaliacaoid, a.usuarioid, classificacao, descricao, nome, data from avaliacao as a JOIN usuario as u ON a.usuarioid = u.usuarioid where jogoid = $1 ORDER BY data"

const delReview = "DELETE FROM avaliacao WHERE avaliacaoid = $1"
const getRateById = "SELECT * FROM avaliacao where avaliacaoid = $1"

const getAllCategories = "SELECT * FROM catprogresso"

const addProgress = "INSERT INTO progressojogo (usuarioid, progressoid, jogoid) VALUES ($1, $2, $3)"
const deleteProgress = "DELETE FROM progressojogo WHERE usuarioid = $1 and jogoid=$2"

const latestGames = "SELECT * FROM jogo WHERE data_lancamento < CURRENT_DATE ORDER BY data_lancamento DESC limit 15"
const futureGames = "SELECT * FROM jogo WHERE data_lancamento > CURRENT_DATE ORDER BY data_lancamento ASC limit 15"
const basedReviewGames = "WITH AvsUsuario AS (\
    SELECT a.*, j.genero \
    FROM avaliacao a \
    JOIN jogo j ON a.jogoid = j.jogoid \
    WHERE a.usuarioid = $1\
  ),\
  JogosRecomendados AS (\
    SELECT au.*, j.*\
    FROM AvsUsuario au \
    JOIN jogo j ON au.genero = j.genero\
    WHERE NOT EXISTS (\
      SELECT 1 \
      FROM avaliacao a \
      WHERE a.usuarioid = $1 AND a.jogoid = j.jogoid\
    )\
  )\
  SELECT * FROM JogosRecomendados;"

const getUserById = "SELECT nome, estado, data_nascimento, cidade, imgurl FROM usuario WHERE usuarioid = $1"
const getFollowing = "select count(*) as count from usuario_segue where usuarioid1 = $1"
const getFollowers = "select count(*) as count from usuario_segue where usuarioid2 = $1"
const getReviewCountUser = "SELECT count(*) as count from avaliacao where usuarioid = $1"
const getCompletedUser = "SELECT count(*) as count from progressojogo where usuarioid = $1 and progressoid = 1"
const getPlayingUser = "SELECT count(*) as count from progressojogo where usuarioid = $1 and progressoid = 2"
const getAbandonedUser = "SELECT count(*) as count from progressojogo where usuarioid = $1 and progressoid = 4"
const followUser = "INSERT INTO usuario_segue (usuarioid1, usuarioid2) VALUES ($1, $2)"
const unfollowUser = "DELETE FROM usuario_segue where usuarioid1=$1 and usuarioid2=$2"
const doFollow = "select * from usuario_segue where usuarioid1 = $1 and usuarioid2 = $2"

const getLastUserReviews = "SELECT a.*, j.nome, j.imgurl FROM avaliacao a JOIN jogo j ON j.jogoid = a.jogoid where a.usuarioid = $1 ORDER BY data LIMIT 3"
const updateUser = "UPDATE usuario SET nome = $1, cidade = $2, estado = $3, data_nascimento = $4, imgurl = $5 WHERE usuarioid = $6"


module.exports = {
  getUser,
  getById,
  checkEmail,
  getRate,
  getGroup,
  getAdvance,
  addUser,
  addRate,
  addGroup,
  addCompany,
  addGame,
  addEmpJogo,
  getGame,
  getGameByName,
  getRateByUserId,
  getRateById,
  getEmpresa,
  getEmpsGame,
  delGame,
  delEmpGame,
  updateGame,
  getGamebyId,
  getReviewAvg,
  getReviewsByGame,
  delReview,
  getAllCategories,
  deleteProgress,
  addProgress,
  latestGames,
  futureGames,
  basedReviewGames,
  getUserById,
  getFollowing,
  getFollowers,
  followUser,
  doFollow,
  unfollowUser,
  getReviewCountUser,
  getAbandonedUser,
  getPlayingUser,
  getCompletedUser,
  getLastUserReviews,
  updateUser,
  highlightGame,
  getHighlightGames
}