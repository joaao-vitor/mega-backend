const express = require('express')
const router = express.Router()

const { getReviewAvg, getReviewsByGame, addReview, delReview } = require('../controllers/reviewController')
const { authenticateUser } = require('../middleware/authenticationMid')

router.route('/avg/:id').get(getReviewAvg)
router.route('/game/:id').get(getReviewsByGame)
router.route('/').post(authenticateUser, addReview)
router.route('/:id').delete(authenticateUser, delReview)

module.exports = router