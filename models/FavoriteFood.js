const mongoose = require('mongoose');

const favoriteFoodSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    portion: { type: Number, required: true },
    unit: { type: String, required: true },
    brand: String,
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
    fiber: { type: Number, default: 0 },
    sugar: { type: Number, default: 0 },
    sodium: { type: Number, default: 0 },
    notes: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Índice composto para garantir que um usuário não tenha alimentos duplicados
favoriteFoodSchema.index({ user: 1, name: 1, brand: 1 }, { unique: true });

// Atualiza o campo updatedAt antes de salvar
favoriteFoodSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('FavoriteFood', favoriteFoodSchema); 