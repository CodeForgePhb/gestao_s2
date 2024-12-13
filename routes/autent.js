const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../db'); // Conexão com o MySQL
const crypto = require('crypto');
const SECRET_KEY = process.env.JWT_SECRET;

const cadastro = async (req, res) => {
    const { nome_usuario, email, senha, setor } = req.body; // Desestrutura os dados do corpo da requisição
    // Verificar se o usuário já existe no banco de dados
    try {
        const [existingUser] = await db.promise().query('SELECT * FROM usuarios WHERE email = ?',
            [email]);
        if (existingUser.length > 0) {
            return res.status(400).send('Usuário já registrado');
        }
        // Criptografar a senha usando bcrypt
        const hashedPassword = await bcrypt.hash(senha, 10);
        // Inserir o novo usuário no banco de dados
        await db.promise().query(
            'INSERT INTO usuarios (nome_usuario, email, password, setor) VALUES (?, ?, ?, ?)',
            [nome_usuario, email, hashedPassword, setor]
        );
        res.status(201).send('Usuário registrado com sucesso');
    } catch (err) {
        console.log('Erro ao registrar usuário:', err);
        res.status(500).send('Erro ao registrar usuário');
    }
};


// const login = async (req, res) => {
//     const { email, senha} = req.body;

//     try {
//         // Verificar se o usuário existe no banco de dados
//         const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
//         if (rows.length === 0) {
//             return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
//         }

//         const usuario = rows[0];

//         // Verificar a senha
//         const senhaValida = await bcrypt.compare(senha, usuario.senha);
//         if (!senhaValida) {
//             return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
//         }

//         // Gerar o token JWT
//         const token = jwt.sign({ id: usuario.id }, SECRET_KEY, { expiresIn: '1h' });

//         // Retornar o token e os dados necessários
//         res.json({ token, usuario: { id: usuario.id, email: usuario.email, nome: usuario.nome}, sucesso:true });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Erro no servidor.' });
//     }
// };

// Função para autenticar um usuário
const login = async (req, res) => {
    const { email, password } = req.body; // Desestrutura os dados do corpo da requisição
  
   // Verificar se o usuário existe no banco de dados
  
    try {
      const [user] = await db.promise().query('SELECT * FROM usuarios WHERE email = ?', [email]);
      if (user.length === 0) {
        return res.status(400).send('Credenciais inválidas');
      }
  
    //   // Comparar a senha fornecida com a senha criptografada no banco de dados
    //   const isMatch = await bcrypt.compare(password, user[0].password);
    //   if (!isMatch) {
    //     return res.status(400).send('Credenciais inválidas');
    //   }
  
      // Gerar um token JWT
      const token = jwt.sign({ userId: user[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.json({ token, usuario: { id: usuario.id, email: usuario.email, nome: usuario.nome} });
    } catch (err) {
      console.error('Erro ao autenticar usuário:', err);
      res.status(500).send('Erro ao autenticar usuário');
    }
};

  

module.exports = {
    cadastro,
    login
};
