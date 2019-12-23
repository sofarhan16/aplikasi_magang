var express = require('express');
var router = express.Router();
const { authController } = require('../controllers');

router.post('/register', authController.register);
router.post('/signin', authController.signin);
router.post('/verified',authController.verified);
router.post('/keeplogin',authController.keeplogin);
router.post('/registeremailpromo',authController.registerEmailPromo);
router.get('/getagentlist',authController.getAgentList);
router.post('/daftaragent',authController.daftaragent);
router.post('/addagentdata', authController.addagentdata);
router.get('/getdaftarinfo/:id_agent',authController.getdaftarinfo);
router.get('/getagentstoredata/:id_agent',authController.getagentstoredata);
router.get('/getagentregisterdata',authController.getagentregisterdata);
router.post('/updatelevel', authController.updatelevel);
router.post('/deletemember', authController.deletemember);
router.post('/updatelimit', authController.updatelimit);
router.post('/addbank', authController.addbank);
router.post('/updatebank/:id', authController.updatebank);
router.post('/forgetuser',authController.forgetuser);
router.post('/resetpassword',authController.resetpassword);
router.post('/changepassword',authController.changepassword);
router.post('/editProfile/:id', authController.editProfile);
router.get('/getUser/:id_user', authController.getUserEdit);
router.post('/batal/', authController.pembatalan);
router.get('/getPayment/:id_user', authController.getPayment)




module.exports = router;