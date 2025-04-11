const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./db');
const diaryRoutes = require('./routes/diary');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname)));

// Conectar ao MongoDB
connectDB().catch(err => {
    console.error('Erro ao conectar com MongoDB:', err);
    process.exit(1);
});

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/diary', diaryRoutes);

// Rota para a página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'login.html'));
});

// Rota para a página de login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'login.html'));
});

// Rota para a página de cadastro
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'register.html'));
});

// Proxy para a API do FatSecret
app.get('/api/fatsecret/*', async (req, res) => {
    try {
        const response = await fetch(`https://platform.fatsecret.com/rest/server.api${req.url.replace('/api/fatsecret', '')}`);
        const text = await response.text();
        
        // Tenta converter o XML para JSON
        try {
            const json = JSON.parse(text);
            res.json(json);
        } catch (e) {
            // Se não conseguir converter, envia o texto como está
            res.send(text);
        }
    } catch (error) {
        console.error('Erro ao fazer proxy para FatSecret:', error);
        res.status(500).json({ error: 'Erro ao acessar a API do FatSecret' });
    }
});

// Tratamento de erros
app.use((err, req, res, next) => {
    console.error('Erro não tratado:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
});

const PORT = process.env.PORT || 3000;

// Verificar se a porta está em uso
const server = app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Porta ${PORT} já está em uso. Tentando encerrar o processo...`);
        // Tentar encerrar o processo que está usando a porta
        require('child_process').exec(`lsof -i :${PORT} | grep LISTEN`, (error, stdout) => {
            if (stdout) {
                const pid = stdout.split(/\s+/)[1];
                require('child_process').exec(`kill ${pid}`, () => {
                    console.log(`Processo ${pid} encerrado. Reiniciando servidor...`);
                    server.listen(PORT);
                });
            }
        });
    } else {
        console.error('Erro ao iniciar o servidor:', err);
        process.exit(1);
    }
}); 