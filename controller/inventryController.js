const userModel = require("../models/userModel");
const inventoryModel = require('../models/inventoryModel');
const { default: mongoose } = require("mongoose");


const createInventryController = async (req, res) => {
 
  try {

    const { email, inventoryType } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error('User not found')
    }
    // Paste top code
     if(inventoryType === 'in' && user.role !== 'donar'){
      throw new Error('Not a donar account')
  } 
    if(inventoryType === 'out' && user.role !== 'hospital'){
      throw new Error('Not a hospital')
  }
    if (req.body.inventoryType == "out") {
      const requestedBloodGroup = req.body.bloodGroup;
      const requestedQuantityOfBlood = req.body.quantity;
      const organisation = new mongoose.Types.ObjectId(req.body.userId);
      //calculate Blood Quanitity
      const totalInOfRequestedBlood = await inventoryModel.aggregate([
        {
          $match: {
            organisation,
            inventoryType: "in",
            bloodGroup: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: { $toDouble: '$quantity' } },
          },
        },
      ])
      //
      console.log("Aggregation Result:", totalInOfRequestedBlood);
      //console.log('Blood', requestedQuantityOfBlood);
      const totalIn = totalInOfRequestedBlood[0]?.total || 0;

      //calculate OUT Blood Quanitity
      const totalOutOfRequestedBloodGroup = await inventoryModel.aggregate([
        {
          $match: {
            organisation,
            inventoryType: "out",
            bloodGroup: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);
      const totalOut = totalOutOfRequestedBloodGroup[0]?.total || 0;

      //in & Out Calc
      const availableQuanityOfBloodGroup = totalIn - totalOut;
      //console.log('avl quantity', availableQuanityOfBloodGroup);

      //quantity validation
      if (availableQuanityOfBloodGroup < requestedQuantityOfBlood) {
        return res.status(500).send({
          success: false,
          message: `Only ${availableQuanityOfBloodGroup}ML of ${requestedBloodGroup.toUpperCase()} is available`,
        });
      }
      req.body.hospital = user?._id;
    } else {
      req.body.donar = user?._id;
    }
    // Save
    const inventory = new inventoryModel(req.body)
    await inventory.save();
    return res.status(201).send({
      success: true,
      message: 'New Blood record Added'
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: 'An error on Inventory APIs',
      error
    })
  }
}
// GET ALL BLOOD RECORS
const getInventoryController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find({
        organisation: req.body.userId,
      })
      .populate("donar")
      .populate("hospital")
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      messaage: "get all records successfully",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Get All Inventory",
      error,
    });
  }
};
// GET Hospital RECORS
const getInventoryHospitalController = async (req, res) => {
  try {
    const { inventoryType, donar } = req.body;
    const inventory = await inventoryModel
      .find({
        inventoryType,
        donar
      })
      .populate("donar")
      .populate("hospital")
      .populate("organisation")
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "get hospital consumer records successfully",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Get consumer Inventory",
      error,
    });
  }
};
// GET BLOOD RECORD OF 3
const getRecentInventoryController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find({
        organisation: req.body.userId,
      })
      .limit(3)
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "recent Invenotry Data",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Recent Inventory API",
      error,
    });
  }
};
//Get Inventory Record
const getDonarController = async (req, res) => {
  try {
    const organisation = req.body.userId;
    // find Donars
    const donarId = await inventoryModel.distinct("donar", {
      organisation,
    })
    //console.log('Donar ka pyar', donarId);
    const donars = await userModel.find({ _id: { $in: donarId } })

    return res.status(200).send({
      success: true,
      message: 'Donar record fached successfully',
      donars
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "Error In Donar Record",
      error,
    });
  }
}
const getHospitalController = async (req, res) => {
  try {
    const organisation = req.body.userId;
    // Get Hospital Id
    const hospitalId = await inventoryModel.distinct('hospital', { organisation })
    // Find Hospital Info
    const hospitals = await userModel.find({
      _id: { $in: hospitalId }
    })
    return res.status(200).send({
      success: true,
      message: 'Sabash Bete tumne kar dhikaya',
      hospitals
    })
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Hospital wali controller ko check kar lo bhai kuch glt hoga.",
      error,
    });
  }
}
// Get  ORG Details
const getOrgnaisationController = async (req, res) => {
  try {
    const donar = req.body.userId;
    const orgId = await inventoryModel.distinct('organisation', { donar })
    // Find ORG
    const organisations = await userModel.find({
      _id: { $in: orgId }
    })
    return res.status(200).send({
      success: true,
      message: 'Tum RSS ORG ke aadmi ho Bhai',
      organisations
    })
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Bhai Tumhara Org nhi pta kha gum gya.",
      error,
    });
  }
}

// Get  ORG Details for Hospital
const getOrgnaisationForHospitalController = async (req, res) => {
  try {
    const hospital = req.body.userId;
    const orgId = await inventoryModel.distinct('organisation', { hospital })
    // Find ORG
    const organisations = await userModel.find({
      _id: { $in: orgId }
    })
    return res.status(200).send({
      success: true,
      message: 'Hospital ke liye ORG Mil gya',
      organisations
    })
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Hospital Heray ga re.",
      error,
    });
  }
}
module.exports = {
  createInventryController,
  getInventoryController,
  getInventoryHospitalController,
  getDonarController,
  getHospitalController,
  getOrgnaisationController,
  getOrgnaisationForHospitalController,
  getRecentInventoryController
}