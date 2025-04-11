const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
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
    notes: String
});

const mealSchema = new mongoose.Schema({
    breakfast: [foodSchema],
    lunch: [foodSchema],
    snack: [foodSchema],
    dinner: [foodSchema],
    other: [foodSchema] // Para refeições adicionais
});

const summarySchema = new mongoose.Schema({
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    fiber: { type: Number, default: 0 },
    sugar: { type: Number, default: 0 },
    sodium: { type: Number, default: 0 },
    water: { type: Number, default: 0 }, // em ml
    notes: String
});

const diarySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    meals: mealSchema,
    summary: summarySchema,
    weight: { type: Number }, // Peso do dia
    mood: { type: String, enum: ['very_good', 'good', 'neutral', 'bad', 'very_bad'] },
    sleep: { type: Number }, // Horas de sono
    exercise: {
        type: String,
        enum: ['none', 'light', 'moderate', 'intense']
    },
    notes: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Índice composto para garantir que um usuário só tenha um diário por dia
diarySchema.index({ user: 1, date: 1 }, { unique: true });

// Atualiza o campo updatedAt antes de salvar
diarySchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Diary', diarySchema); 