const express = require('express');
const router = express.Router();
const {
  authenticateUser,
//   authorizePermissions,
} = require('../middleware/authenticationMid');
const {
  showMe, getUser, followUser, doFollow, unfollowUser, getLastUserReviews, updateUser,
} = require('../controllers/userController');

router.route('/me').get(authenticateUser, showMe);
router.route('/follow/:id').post(authenticateUser, followUser);
router.route('/unfollow/:id').delete(authenticateUser, unfollowUser);
router.route('/doFollow/:id').get(authenticateUser, doFollow);
router.route('/lastReviews/:id').get(getLastUserReviews);
router.route('/').put(authenticateUser, updateUser);
router.route('/:id').get(getUser);

module.exports = router;