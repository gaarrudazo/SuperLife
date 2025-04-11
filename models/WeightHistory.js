const mongoose = require('mongoose');

const weightHistorySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    weight: { type: Number, required: true }, // em kg
    bodyFat: { type: Number }, // porcentagem
    notes: String,
    createdAt: { type: Date, default: Date.now }
});

// Índice composto para garantir que um usuário só tenha um registro de peso por dia
weightHistorySchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('WeightHistory', weightHistorySchema); 