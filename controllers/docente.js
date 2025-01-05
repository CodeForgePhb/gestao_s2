// const db = require('../config/db'); // Importar a conexão com o banco
// const jwt = require('jsonwebtoken');
import db from '../config/db.js'; // Importa a conexão com o banco
import jwt from 'jsonwebtoken';
// //------------------------ROTAS GET
//---------BUSCA CURSOS VIGENTES----------
export const buscarCursosVigentes = async (req, res) => {
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
// ----- BUSCAR CURSOS CONCLUIDOS --------
export const buscarCursosConcluidos = async (req, res) => {
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
      return res.status(404).json({ message: 'Curso não encontrado.' });
    }
    const { nome_usuario } = userResult[0];
    const {data_inicio, data_fim} = req.body
    // 4. Busca os cursos onde professor = nome_usuario
    const [cursosResult] = await db.query(
      `SELECT 
        c.nome_curso, 
        c.data_inicio, 
        c.data_fim
      FROM 
        cursos c
      JOIN 
        cursos_concluidos cc 
        ON c.nome_curso = cc.nome_curso
      JOIN 
        professor p 
        ON cc.professor = p.nome
      WHERE 
        p.nome = ?
        AND (
            (c.data_inicio = ? AND c.data_fim = ?)
            OR c.nome_curso LIKE '%data_inicio = ?%'
        )'`
    [nome_usuario, data_inicio, data_fim]);
  if (cursosResult.length === 0) {
    return res.status(404).json({ message: 'Nenhum curso encontrado para este professor.' });
  }
// 5. Retorna a lista de cursos
res.status(200).json({ cursos: cursosResult });
    } catch (err) {
  console.error('Erro ao buscar cursos Concluidos:', err);
  res.status(500).json({ message: 'Erro ao buscar cursos Concluidos.' });
  }
};
// module.exports = {
//   buscarCursosVigentes,
//   buscarCursosConcluidos
// }
