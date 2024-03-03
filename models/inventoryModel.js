const mongoose = require("mongoose")
const inventorySchema = new mongoose.Schema({
    inventoryType: {
        type: String,
        required: [true, 'inventory type required'],
        enum: ["in", "out"],
    },
    bloodGroup: {
        type:String,
        required:[true, "blood group is required"],
        enum: ["O+", "O-", "AB+", "AB-", "A+", "A-", "B+", "B-"],
    },
    quantity: {
        type: String,
        required:[true, "blood quantity is required"],
    },
    email: {
        type:String,
        required:[true, "email is required"]
    },
    organisation:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [true, "organisation is required"],
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: function () {
          return this.inventoryType === "out";
        },
      },
      donar: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: function () {
          return this.inventoryType === "in";
        },
      },
    },
    {timestamps: true}
    );
    module.exports = mongoose.model("Inventory", inventorySchema);