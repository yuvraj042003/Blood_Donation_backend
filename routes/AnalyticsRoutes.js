const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { bloodGroupDetailsContoller,
} = require('../controller/AnalyticsController');
const router = express.Router();

// Routes
//GET BLOOD DATA
router.get("/bloodGroups-data", authMiddleware, bloodGroupDetailsContoller);

module.exports = router