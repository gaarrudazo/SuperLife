const express = require('express');
const router = express.Router();
const Diary = require('../models/Diary');

// Salvar ou atualizar diário
router.post('/', async (req, res) => {
    try {
        const { date, meals, summary } = req.body;
        
        // Converter a string de data para objeto Date
        const diaryDate = new Date(date);
        
        // Verificar se já existe um diário para esta data
        let diary = await Diary.findOne({ date: diaryDate });
        
        if (diary) {
            // Atualizar diário existente
            diary.meals = meals;
            diary.summary = summary;
        } else {
            // Criar novo diário
            diary = new Diary({
                date: diaryDate,
                meals,
                summary
            });
        }
        
        await diary.save();
        res.status(200).json({ message: 'Diário salvo com sucesso' });
    } catch (error) {
        console.error('Erro ao salvar diário:', error);
        res.status(500).json({ error: 'Erro ao salvar diário' });
    }
});

// Carregar diário por data
router.get('/:date', async (req, res) => {
    try {
        const date = new Date(req.params.date);
        const diary = await Diary.findOne({ date });
        
        if (!diary) {
            // Retornar diário vazio se não existir
            return res.json({
                meals: {
                    breakfast: [],
                    lunch: [],
                    snack: [],
                    dinner: []
                },
                summary: {
                    calories: 0,
                    protein: 0,
                    carbs: 0,
                    fat: 0
                }
            });
        }
        
        res.json(diary);
    } catch (error) {
        console.error('Erro ao carregar diário:', error);
        res.status(500).json({ error: 'Erro ao carregar diário' });
    }
});

module.exports = router; 