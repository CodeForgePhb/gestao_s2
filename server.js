const express = require('express');
const cors = require('cors');
const routes = require('./routes'); // Importar o arquivo de rotas

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

app.use(express.static('public'));

// Rotas
app.use('/api', routes); // Prefixo /api para todas as rotas

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}/api`);
});