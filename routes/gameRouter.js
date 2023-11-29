const express = require('express')
const router = express.Router()

const {
    uploadProductImage,
    addGame,
    removeGame,
    updateGame,
    getGamebyId,
    latestGames,
    futureGames,
    basedReviewGames,
    getGameByName,
    highlightGame,
    getHighlightGames
} = require('../controllers/gameController')
const { authenticateUser } = require('../middleware/authenticationMid')

router.route('/upload').post(uploadProductImage)
router.route('/add').post(addGame)
router.route('/update/:id').put(updateGame)
router.route('/remove/:id').delete(removeGame)
router.route('/latest').get(latestGames)
router.route('/future').get(futureGames)
router.route('/basedReviews').get(authenticateUser, basedReviewGames)
router.route('/buscar').get(getGameByName);
router.route('/highlight').get(getHighlightGames);
router.route('/highlight/:id').patch(highlightGame);
router.route('/:id').get(getGamebyId)

module.exports = router