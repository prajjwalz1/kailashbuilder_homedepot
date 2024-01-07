const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const Organization = require('./organization.model')
const Role = require('../models/role.model')

const userContactSchema = new Schema({
    city:{
        type:String
    },
    state:{
        type:String
    },
    street:{
        type:String
    },
    mobile_number:{
        type:String
    }
})

const fieldOfPractice = new Schema({
    name:{
        type:String
    },
    level:{
        type:String
    }
})

const time = new Schema({
    start:{
        type:Date,
        default:"08:00"
    },
    end:{
        type:Date,
        default:"17:00"
    }
})

const clinicianTiming = new Schema({
    sunday:time,
    monday:time,
    tuesday:time,
    wednesday:time,
    thursday:time,
    friday:time,
    saturday:time
})

const clinicianSchema = new Schema({
    practitioner_no:{
        type: String
    },
    license_no:{
        type: String
    },
    qualification:{
        type: String
    },
    qualification_year:{
        type:Date
    },
    license_expire_date:{
        type:Date
    },
    issuing_country:{
        type:String
    },
    field_of_practice:[
        fieldOfPractice
    ],
    work_timing:clinicianTiming
})


const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin:{
        type:Boolean,
        required:false,
        default:false
    },
    profile_picture:{
        type: String,
    },
    title:{
        type:String,
    },
    full_name:{
        type:String,
        required:true
    },
    dob:{
        type:Date,
    },
    gender:{
        type:String,
        required:true
    },
    warehouse:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "warehouse"
    },
    monthly_salary:{
        type:Number,
        default:0
    },
    salary_start_date:{
        type:Date,
        required:true,
        default:Date.now()
    },
    next_salary_date:{
        type:Date,
        required:true,
        default:Date.now()
    },
    total_spent:{
        type:Number
    },
    user_contact:userContactSchema,
    roles:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "role"
        }
    ],
    organization_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "organization"
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

UserSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(this.password, salt)
        this.password = hashedPassword
        next()
    } catch (error) {
        next(error)
    }

})

UserSchema.post('save', async function (next) {
    try {
        console.log("called after saving user")
    } catch (error) {
        next(error)
    }

})

UserSchema.methods.isValidPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        throw error
    }
}

const User = mongoose.model('user', UserSchema)

module.exports = User