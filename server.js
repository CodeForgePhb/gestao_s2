import path from 'path';
import { fileURLToPath } from 'url';

// Definir __dirname manualmente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import session from 'express-session';
import db from './config/db.js';
import authenRoutes from './routes/authen.js';
import routes from './routes/routes.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuração da sessão (já incluída)
const secret = process.env.SESSION_SECRET;
app.use(
  session({
    secret: `${secret}`,
    resave: false,
    saveUninitialized: true,
  })
);

// Função para verificar se o usuário está autenticado
function verificarAutenticacao(req, res, next) {
  const usuario = req.session.usuario; // Pegar o usuário da sessão
  if (!usuario) {
    return res.redirect('/acesso_negado.html'); // Redireciona para o login se não estiver autenticado
  }
  next(); // Se estiver autenticado, continua para a próxima rota
}

// Função para verificar acesso com base no papel
function verificarAcesso(permissoesPermitidas) {
  return (req, res, next) => {
    const usuario = req.session.usuario; // Pegar o usuário da sessão
    if (usuario && permissoesPermitidas.includes(usuario.setor)) {
      return next();
    }
    res.redirect('/acesso_negado.html'); // Página de acesso negado
  };
}

// Rotas para cada página com verificação de acesso
app.get('/docente.html', verificarAutenticacao, verificarAcesso(['docente']), (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'docente.html'));
});
app.get('/coordenacao.html', verificarAutenticacao, verificarAcesso(['coordenação']), (req, res) => {
  res.sendFile(path.join(__dirname,'public', 'coordenacao.html'));
});
app.get('/gestao.html', verificarAutenticacao, verificarAcesso(['gestão']), (req, res) => {
  res.sendFile(path.join(__dirname,'public', 'gestao.html'));
});
app.get('/setor_de_compras.html', verificarAutenticacao, verificarAcesso(['setor de compras']), (req, res) => {
  res.sendFile(path.join(__dirname,'public', 'setor_de_compras.html'));
});

app.use(express.static('public'));

app.use('/api/authen', authenRoutes);
app.use('/api/routes', routes);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const PORT = process.env.PORT || 3001;

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando, acesse: http://localhost:${PORT}`);
});
