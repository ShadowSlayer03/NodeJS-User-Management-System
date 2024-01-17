const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");

router.get('/',userController.view);
router.get('/adduser',userController.form);
router.post('/adduser',userController.postuser);
router.get('/edituser/:id',userController.edit);
router.post('/edituser/:id',userController.update);
router.get('/:id',userController.delete);
router.get('/viewuser/:id',userController.viewuser);


module.exports = router;