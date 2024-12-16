const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(express.static('public'));

const authenRoutes = require('./routes/authen');
const routes = require('./routes/routes');
app.use('/api/authen', authenRoutes);
//app.use('/api/routes', routes);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const PORT = process.env.PORT || 3001;
// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando, acesse: http://localhost:${PORT}`);
});