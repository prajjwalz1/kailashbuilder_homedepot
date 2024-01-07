const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ApprovalSchema = new Schema({
    warehouse_start:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"warehouse",
        required:true
    },
    warehouse_end:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"warehouse"
    },
    product_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"product",
    },
    isApproved:{
        type:Boolean,
        required:true
    },
    stock_count:{
        type:Number
    },
    retail_price:{
        type:Number
    },
    type:{
        type:String,
        required: true,
        enum: ['update', 'transfer']
    },
    total_price:{
        type:Number,
        required:true
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

const Approval = mongoose.model('approvals', ApprovalSchema)

module.exports = Approval