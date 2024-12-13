const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Controllersrouter = require('./routes/routes'); // Importar o arquivo de rotas

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
// Rotas
app.use('/api/routes', Controllersrouter);

app.use(express.static('public'));


app.get('/login', (req, res) => {
  // res.send('Conectado ao servidor.')
  res.sendFile(__dirname + '/public/index.html')
})



// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});