const mongoose = require('mongoose')
const validator = require('validator')
const slugify = require('slugify')
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Enter a name'],
        //validate : [validator.isAlpha , 'enter string only']
    },
    details: {
        type: String,
        required: [true, 'Enter details'],
    },
    slug: String,
    completed: {
        type: String,
        enum: ['done', 'not done'],
        required: [true, 'Enter status'],
        default: 'not done'
    },
    images: {
        type: [String]
    },
//    user: {
//        type: mongoose.Schema.ObjectId,
//        ref: 'User'
//    }
}, {
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
})
///////////////////////////////////////////////////////
//schema.pre(/^find/, function (next) {
//    this.populate({
//        path: 'user',
//        select: '-tasks',
//    });
//    next();
//});
schema.pre('save', function (next) {
    this.slug = slugify(this.name, {lower: true})
    next()
})
///////////////////////////////////////////////////////
const Task = mongoose.model('Task', schema)
module.exports = Task