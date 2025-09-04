const mongoose = require('mongoose');

const portfolioImageSchema = new mongoose.Schema({
    url: { type: String, required: true },
    publicId: { type: String },
}, { _id: false });

const portfolioSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    images: {
        type: [portfolioImageSchema],
        validate: [arrayLimit, '{PATH} exceeds the limit of 4']
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

function arrayLimit(val) {
    return !val || val.length <= 4;
}

module.exports = mongoose.model('Portfolio', portfolioSchema);
