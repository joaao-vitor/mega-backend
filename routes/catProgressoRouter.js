const express = require('express')
const router = express.Router()
const { authenticateUser } = require('../middleware/authenticationMid');
const { getAllCategories } = require('../controllers/catProgressoController')

router.get('/', getAllCategories)

module.exports = router