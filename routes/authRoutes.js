const express = require('express');
const { registerController, loginController, currentUserController } = require('../controller/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

//Router || POST
router.post('/register', registerController)
//Login || POST
router.post('/login', loginController)
// CurrentUser || GET
router.get('/current-user', authMiddleware, currentUserController)
module.exports = router;

