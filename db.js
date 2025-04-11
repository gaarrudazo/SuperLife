const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI não está definida no arquivo .env');
        }

        await mongoose.connect(process.env.MONGODB_URI);

        console.log('MongoDB conectado com sucesso');
        
        // Verificar se a conexão está ativa
        mongoose.connection.on('error', (err) => {
            console.error('Erro na conexão com MongoDB:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('Conexão com MongoDB perdida');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('Conexão com MongoDB restaurada');
        });

    } catch (error) {
        console.error('Erro ao conectar com MongoDB:', error);
        throw error;
    }
};

module.exports = connectDB; 