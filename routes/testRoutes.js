const express = require('express');
const { testController } = require('../controller/testController');
//router object
const router = express.Router();

// object
router.get('/test', testController)

// export
module.exports = router;
