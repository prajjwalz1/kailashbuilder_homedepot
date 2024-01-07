const mongoose = require("mongoose")
const Schema = mongoose.Schema

const MachineSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    brand:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"brand",
    },
    cost_per_hour:{
        type:Number,
        required:true
    },
    amount_spent:{
        type:Number,
        default:0
    },
    time_spent:{
        type:Number,
        default:0
    },
    organization_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"organization",
        required:true
    },
    created_at:{
        type:Date,
        default:Date.now()
    },
    updated_at:{
        type:Date,
        default:Date.now()
    },
    deleted_at:{
        type:Date,
        default:null
    },
})

const Machine = mongoose.model('machine', MachineSchema)

module.exports = Machine