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
      'SELECT nome FROM cadastro WHERE email = ?',
      [email]
    );
    if (userResult.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    const { nome } = userResult[0]; // Nome do usuário
    // 4. Busca os cursos onde professor = nome_usuario
    const [cursosResult] = await db.query(
      'SELECT nome_curso FROM cursos_vigentes WHERE docente = ?',
      [nome]
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
      'SELECT nome_usuario FROM cadastro WHERE email = ?',
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
        c.nome, 
        c.data_inicio, 
        c.data_fim
      FROM 
        curso c
      JOIN 
        cursos_concluidos cc 
        ON c.nome = cc.nome_curso
      JOIN 
        docente d
        ON cc.docente = d.nome
      WHERE 
        d.nome = '?'
        AND (
            (c.data_inicio = '?' AND c.data_fim = '?')
            OR c.nome LIKE c.data_inicio = '%?%'
        );`
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

/*------ BUSCAR SOLICITAÇÕES --------- */

export const TodasSolicitacoes = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    //1.
    if(!token) {
      return res.status(401).json({message: 'Token não fornecido'})
    }
    //2.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const {email} = decoded;
    //3.
    const result = await db.query('SELECT* FROM solicitacao_kit WHERE email = ?', [email]);
    if(result.length === 0) {
      res.status(404).json({message : 'usuário não possui solicitações'});
    }
    res.status(200).json({message : "Deu bom", result});

    console.log({result})
  } catch(error) {
    res.status(500).json({error});
    console.log(error);
  }
};



