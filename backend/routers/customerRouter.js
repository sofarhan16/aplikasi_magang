var express = require('express');
var router = express.Router();
const { customerController } = require('../controllers');

router.post('/addcustomer', customerController.addcustomer);
router.get('/getnews', customerController.getnews);
router.post('/updatenews', customerController.updatenews);
router.post('/searchcustomer', customerController.searchcustomer);
router.post('/getcustomer', customerController.getcustomers);
router.post('/getcustomerid', customerController.getcustomersid);
router.put('/editcustomer/:id_customer', customerController.editcustomer);
router.delete('/deletecustomer/:id_customer', customerController.deletecustomer);
router.put('/addfilebpom/:id', customerController.addfilebpom);
module.exports = router;