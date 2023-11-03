const mongoose = require('mongoose')
const validator = require('validator')
//const slugify = require('slugify')
const bcrypt = require('bcryptjs')
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Enter a name'],
        unique: true,
        trim: true,
        maxLength: [40, 'name should be lt 40'],
        minLength: [4, 'name should be gt 5'],
    },
    email: {
        type: String,
        validate: [validator.isEmail, 'enter email'],
        unique: true,
        lower: true,
        required: [true, 'Enter email'],
    },

    tasks: {
        type: [mongoose.Schema.ObjectId],
        ref: 'Task',
    },
    password: {
        type: String,
        required: [true, 'Enter password'],
        minLength: 8,
        select: false
    },
    confirmPassword: {
        type: String,
        validate: { // only work on save,create
            validator: function (val) {
                return this.password === val
            },
            message: "confirm is not correct"
        },
        required: [true, 'Enter confirm'],
    },
    photo: {
        type: String,
        default: 'default.jpg'
    },
    active: {
        type: Boolean,
        default: true,
    },
    changePasswordAt: Date
}, {
    timestamps: true
})
/////////////////////////////////////////////////////////////
schema.pre(/^find/, function (next) {
    this.populate('tasks')
    next()
})
// to encrypt the password
schema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 12)
    this.confirmPassword = undefined
    next()
})
/////////////////////////////////////////////////////////////
schema.methods.checkPassword = async function (userP, storedP) {
    return await bcrypt.compare(userP, storedP)
}
schema.methods.userChangePassword = function (jwtIat) {
    if (this.changePasswordAt) {
        const changeInStamp = this.changePasswordAt.getTime() / 1000
        return changeInStamp > jwtIat
    }
    return false
}
/////////////////////////////////////////////////////////////
const User = mongoose.model('User', schema)
module.exports = User