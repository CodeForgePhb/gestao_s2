const db = require('../config/db'); // Conexão com o MySQL
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const cadastro = async (req, res) => {
  const { nome_usuario, email, senha, setor } = req.body; // Desestrutura os dados do corpo da requisição
  // Verificar se o usuário já existe no banco de dados
  try {
    const [existingUser] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).send('Usuário já cadastrado.');
    }
    // Criptografar a senha usando bcrypt
    const hashedSenha = await bcrypt.hash(senha, 10);
    // Inserir o novo usuário no banco de dados
    await db.query(
      'INSERT INTO usuarios (nome_usuario, email, senha, setor) VALUES (?, ?, ?, ?)',
      [nome_usuario, email, hashedSenha, setor]
    );
    res.status(201).json({ message: 'Usuário cadastrado com sucesso.' });
  } catch (err) {
    console.error('Erro ao cadastrar usuário:', err);
    res.status(500).send('Erro ao cadastrar usuário.');
  }
};
// Função para autenticar um usuário
const login = async (req, res) => {
  const { email, senha } = req.body; // Desestrutura os dados do corpo da requisição
  // Verificar se o usuário existe no banco de dados
  try {
    const [user] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (user.length === 0) {
      return res.status(400).send('Credenciais inválidas (email)'); //quando sucesso remover (email)
    }
    // Comparar a senha fornecida com a senha criptografada no banco de dados
    const isMatch = await bcrypt.compare(senha, user[0].senha);
    if (!isMatch) {
      return res.status(400).send('Credenciais inválidas (senha)'); //quando sucesso remover (senha)
    }
    // Gerar um token JWT
    const token = jwt.sign(
      { userId: user[0].id, email: user[0].email, nome: user[0].nome }, //aqui gera o token com essas informações para depois ser descriptografado
      process.env.JWT_SECRET, { expiresIn: '1h' }
    );
    res.json({ token, usuario: { id: usuario.id, email: usuario.email, nome: usuario.nome } }); //aqui mostra o token e os dados sem necessidade de descriptografar
  } catch (err) {
    console.error('Erro ao autenticar usuário:', err);
    res.status(500).send('Erro ao autenticar usuário');
  }
};

module.exports = {
  cadastro,
  login
};