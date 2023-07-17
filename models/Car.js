const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
    mark: {
        type: String,
    },
    model: {
        type: String,
    },
    engine: {
        power: {
            type: Number,
        },
        volume: {
            type: Number,
        },
        transmission: {
            type: String,
        },
        fuel: {
            type: String,
        },
    },
    drive: {
        type: String,
    },
    equipmentName: {
        type: String,
    },
    price: {
        type: Number,
    },
    },
    {
        timestamps: true
    })

module.exports = mongoose.model('Car', CarSchema);