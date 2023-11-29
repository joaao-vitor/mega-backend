const { Router } = require('express');
const controller = require('./controllers');
const router = Router();

router.post('/', controller.addUser);
router.post('/addr', controller.addRate);
router.post('/addg', controller.addGroup);
router.post('/addc', controller.addCompany);
router.get('/user/', controller.getUser);
router.get('/rate/', controller.getRate);
router.get('/empresa/', controller.getEmpresa);
router.get('/group/', controller.getGroup);
router.get('/games/', controller.getGame);
router.get('/advance/', controller.getAdvance);
router.get('/rateuser/:iduser', controller.getRateById);
router.get('/:id', controller.getById);



module.exports = router;
