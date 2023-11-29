const express = require('express')
const router = express.Router()
const { authenticateUser } = require('../middleware/authenticationMid');
const { addProgress, deleteProgress } = require('../controllers/userProgressController')

router.post('/', authenticateUser, addProgress)
router.delete('/', authenticateUser, deleteProgress)

module.exports = router