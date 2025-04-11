const express = require('express');
const router = express.Router();
const path = require('path');

// Rota para a página inicial
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Rota para o diário
router.get('/diario', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/pages/diario.html'));
});

// Rota para a calculadora
router.get('/calculadora', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/pages/calculadora.html'));
});

module.exports = router; 