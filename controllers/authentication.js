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


const buscarSetor = async (req, res) => {
  try {
    // 1. Extrai o token do cabeçalho Authorization
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido.' });
    }

    // 2. Verifica e decodifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email } = decoded; // Desestrutura o email do payload do token

    // 3. Consulta SQL para buscar o setor do usuário
    const [result] = await db.query('SELECT setor FROM usuarios WHERE email = ?', [email]);

    if (result.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // 4. Retorna o setor do usuário
    const { setor } = result[0]; // Desestrutura o setor da resposta do banco
    res.status(200).json({ setor });
  } catch (err) {
    console.error('Erro ao buscar setor do usuário:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};


const login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const [user] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (user.length === 0) {
      return res.status(400).send('Credenciais inválidas (email)');
    }

    const isMatch = await bcrypt.compare(senha, user[0].senha);
    if (!isMatch) {
      return res.status(400).send('Credenciais inválidas (senha)');
    }

    // Gerar o token JWT com setor incluído
    const token = jwt.sign(
      { 
        userId: user[0].id, 
        email: user[0].email, 
        nome: user[0].nome, 
        setor: user[0].setor // Inclui setor no token
      },
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    // Envia token e setor na resposta
    res.json({ 
      token, 
      usuario: { 
        id: user[0].id, 
        email: user[0].email, 
        nome: user[0].nome, 
        setor: user[0].setor 
      } 
    });
    console.log(token)
    const decodedToken = jwt.decode(token);
    console.log('Token Decodificado:', decodedToken);

  } catch (err) {
    console.error('Erro ao autenticar usuário:', err);
    res.status(500).send('Erro ao autenticar usuário');
  }
};

const buscarNome = async (req, res) => {
  try {
    // 1. Extrai o token do cabeçalho Authorization
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido.' });
    }

    // 2. Verifica e decodifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email } = decoded; // Desestrutura o email do payload do token

    // 3. Busca o nome do usuário na tabela usuarios
    const [userResult] = await db.query(
      'SELECT nome_usuario FROM usuarios WHERE email = ?',
      [email]
    );

    if (userResult.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // 5. Retorna o nome do usuário
    res.status(200).json({ nome: userResult[0]?.nome_usuario });
    console.log(userResult)
  } catch (err) {
    console.error('Erro ao buscar o nome:', err);
    res.status(500).json({ message: 'Erro ao buscar o nome.' });
  }
};

module.exports = {
  cadastro,
  buscarSetor,
  login,
  buscarNome
};