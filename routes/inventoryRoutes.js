const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { createInventryController,
      getInventoryController,
      getDonarController,
      getHospitalController,
      getOrgnaisationController,
      getOrgnaisationForHospitalController,
      getRecentInventoryController } = require('../controller/inventryController');
const router = express.Router();

// Routes
//Create-inventory || POST
router.post('/create-inventory', authMiddleware, createInventryController);
// Get All records
router.get('/get-inventory', authMiddleware, getInventoryController)
// Get Hospital records
router.post('/get-inventory-hospital', authMiddleware, getOrgnaisationForHospitalController)
// Get Donars Record
router.get('/get-donars', authMiddleware, getDonarController)
// Get Hospitals Record
router.get('/get-hospitals', authMiddleware, getHospitalController)
// Get orgnaisation Record
router.get('/get-orgnaisation', authMiddleware, getOrgnaisationController)
// Get orgnaisation For Hospital Record
router.get('/get-orgnaisation-for-hospital', authMiddleware, getOrgnaisationForHospitalController)
module.exports = router
router.get(
    "/get-recent-inventory",
    authMiddleware,
    getRecentInventoryController
  );