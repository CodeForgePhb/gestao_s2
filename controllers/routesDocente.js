const db = require('../config/db'); // Importar a conexão com o banco
const jwt = require('jsonwebtoken');


// //------------------------ROTAS GET

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
      res.status(200).json({ nome: userResult });
    } catch (err) {
      console.error('Erro ao buscar o nome:', err);
      res.status(500).json({ message: 'Erro ao buscar o nome.' });
    }
  };

const buscarCursosVigentes = async (req, res) => {
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
  
      const { nome_usuario } = userResult[0]; // Nome do usuário
  
      // 4. Busca os cursos onde professor = nome_usuario
      const [cursosResult] = await db.query(
        'SELECT nome_curso FROM cursos_vigentes WHERE professor = ?',
        [nome_usuario]
      );
  
      if (cursosResult.length === 0) {
        return res.status(404).json({ message: 'Nenhum curso encontrado para este professor.' });
      }
  
      // 5. Retorna a lista de cursos
      res.status(200).json({ cursos: cursosResult });
    } catch (err) {
      console.error('Erro ao buscar cursos:', err);
      res.status(500).json({ message: 'Erro ao buscar cursos.' });
    }
  };

  const buscarCursosConcluidos = async (req, res) => {
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
  
      const { nome_usuario } = userResult[0]; // Nome do usuário
  
      // 4. Busca os cursos onde professor = nome_usuario
      const [cursosResult] = await db.query(
        'SELECT nome_curso FROM cursos_vigentes WHERE professor = ?',
        [nome_usuario]
      );
  
      if (cursosResult.length === 0) {
        return res.status(404).json({ message: 'Nenhum curso encontrado para este professor.' });
      }
  
      // 5. Retorna a lista de cursos
      res.status(200).json({ cursos: cursosResult });
    } catch (err) {
      console.error('Erro ao buscar cursos:', err);
      res.status(500).json({ message: 'Erro ao buscar cursos.' });
    }
  };
  



 module.exports = {
    buscarNome,
    buscarCursosVigentes,
    buscarCursosConcluidos
 }

