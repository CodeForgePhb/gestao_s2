import db from '../config/db.js'; // Importa a conexão com o banco
import jwt from 'jsonwebtoken';
// //------------------------ROTAS GET
//---------CARREGAR CURSOS VIGENTES----------
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
      'SELECT nome FROM docente WHERE email = ?',
      [email]
    );
    if (userResult.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    const { nome } = userResult[0]; // Nome do usuário
    // 4. Busca os cursos onde professor = nome_usuario
    const [cursosResult] = await db.query(
      `SELECT 
        c.nome, c.turno, c.ch_total, c.modalidade, c.localidade, c.financiamento, c.turma, c.data_inicio, c.data_fim, c.cod
      FROM 
        cursos_vigentes cv INNER JOIN curso c ON cv.id_curso = c.id WHERE cv.docente = ?
      `,
      [nome]
    );
    if (cursosResult.length === 0) {
      return res.status(404).json({ message: 'Nenhum curso encontrado para este professor.' });
    }
    // 5. Retorna a lista de cursos
    return res.status(200).json({ cursos: cursosResult });
  } catch (err) {
    console.error('Erro ao buscar cursos:', err);
    res.status(500).json({ message: 'Erro ao buscar cursos.' });
  }
};
// ====== CARREGAR CURSOS CONCLUÍDOS ========
export const carregarCursosConcluídos = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido' })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email } = decoded;
    const [userResult] = await db.query('SELECT nome FROM docente WHERE email=?', [email])
    if (userResult.length === 0) {
      return res.status(404).json({ message: 'Curso não encontrado.' });
    }
    const { nome } = userResult[0];
    // 4. Busca os cursos onde professor = nome_usuario
    const [cursosResult] = await db.query(
      `SELECT *
          FROM cursos_concluidos
          WHERE docente=?`,
      [nome]);
    if (cursosResult.length === 0) {
      return res.status(404).json({ message: 'Nenhum curso encontrado para este professor.' });
    }
    // 5. Retorna a lista de cursos
    //console.log(cursosResult)
    return res.status(200).json({ cursos: cursosResult });
  } catch (err) {
    console.error('Erro ao buscar cursos Concluidos:', err);
    res.status(500).json({ message: 'Erro ao buscar cursos Concluidos.', err });
  }
};
// ----- BUSCAR CURSOS CONCLUIDOS --------
export const buscarCursosConcluidos = async (req, res) => {
  try {
    const { data_inicio, data_fim } = req.body;
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
      'SELECT nome FROM docente WHERE email = ?',
      [email]
    );
    if (userResult.length === 0) {
      return res.status(404).json({ message: 'Curso não encontrado.' });
    }
    const { nome } = userResult[0];
    // 4. Busca os cursos onde professor = nome_usuario
    const [cursosResult] = await db.query(
      `SELECT *
      FROM cursos_concluidos
      WHERE docente=? AND data_inicio >= ?
      AND data_fim <= ?;`,
      [nome, data_inicio, data_fim]);
    if (cursosResult.length === 0) {
      return res.status(404).json({ message: 'Nenhum curso encontrado para este professor.' });
    }
    // 5. Retorna a lista de cursos
    //console.log(cursosResult)
    return res.status(200).json({ cursos: cursosResult });
  } catch (err) {
    console.error('Erro ao buscar cursos Concluidos:', err);
    res.status(500).json({ message: 'Erro ao buscar cursos Concluidos.', err });
  }
};
//========== buscar cursos concluidos em pesquisa
export const buscarCursosConcluidosPorPesquisa = async (req, res) => {
  try {
    const { query } = req.body;
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
      'SELECT nome FROM docente WHERE email = ?',
      [email]
    );
    if (userResult.length === 0) {
      return res.status(404).json({ message: 'Curso não encontrado.' });
    }
    const { nome } = userResult[0];
    // 4. Busca os cursos onde professor = nome_usuario
    // if(query.length === 0){
    //   const results = db.query(
    //     "select * from cursos_concluidos where docente = ?",
    //     [nome]
    //   )
    //   return res.status(200).json({ cursos:results });
    // }
    let cursosResult;
    if (query === '' || query.length === 0) {
      [cursosResult] = await db.query('SELECT * FROM cursos_concluidos where docente = ?', [nome])
    }
    else {
      [cursosResult] = await db.query(
        `SELECT * FROM cursos_concluidos WHERE docente=? AND (nome_curso LIKE ? OR data_inicio LIKE ? OR data_fim LIKE ?)`,
        [nome, `%${query}%`, `%${query}%`, `%${query}%`]);
    }
    if (cursosResult.length === 0) {
      return res.status(404).json({ message: 'Nenhum curso encontrado para este professor.' });
    }
    // 5. Retorna a lista de cursos
    //console.log(cursosResult)
    return res.status(200).json({ cursos: cursosResult });
  } catch (err) {
    console.error('Erro ao buscar cursos Concluidos:', err);
    res.status(500).json({ message: 'Erro ao buscar cursos Concluidos.', err });
  }
};
/*------ BUSCAR SOLICITAÇÕES --------- */
//2. visualizar todos os kits de um curso especifico
export const todosKits = async (req, res) => {
  const { nome_curso } = req.body;
  try {
    const token = req.headers.authorization?.split(' ')[1];
    //1. 
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido' })
    }
    const [result] = await db.query('SELECT nome_kit FROM kit WHERE curso = ?',
      [nome_curso]
    );
    // Verifica se o array está vazio ou indefinido
    if (result.length === 0) {
      return res.status(404).json({ message: 'Curso não possui kit.' });
    }
    // Retorna os kits encontrados
    //console.log(result); // Mostra todos os kits no console
    return res.status(200).json(result); // Retorna o array completo no response
  } catch (error) {
    console.error('Erro ao buscar kits.', error);
    return res.status(500).json({ message: 'Erro ao buscar kits.', error });
  }
};
//3. Visualizar materiais dentro dos kit didáticos
export const todosMateriais = async (req, res) => {
  const { nome_kit } = req.body;
  try {
    //1.
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido' })
    }
    //2.
    const [result] = await db.query(
      'SELECT cod_produto, descricao, qnt_max, unidade_medida, saldo from materiais WHERE nome_kit = ?', [nome_kit]);
    // Verifica se o array está vazio ou indefinido
    if (result.length === 0) {
      return res.status(404).json({ message: 'Não há materiais para o kit.' });
    }
// Retorna os kits encontrados
    //console.log(result); // Mostra todos os kits no console
    return res.status(200).json(result); // Retorna o array completo no response
  } catch (error) {
    console.error('Erro ao buscar os materiais.', error);
    return res.status(500).json({ message: 'Erro ao buscar os materiais.', error });
  }
}
export const dadosCursoClicado = async (req, res) => {
  const { cod } = req.body;
  try {
    //1.
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido' })
    }
    //2.
    const [result] = await db.query(
      `SELECT nome, matriculas_previstas, turno, ch_total, modalidade, financiamento,
      localidade, turma, data_inicio, data_fim, cod, docente FROM curso WHERE cod = ?`, [cod]);
    // Verifica se o array está vazio ou indefinido
    if (result.length === 0) {
      return res.status(404).json({ message: 'Não há materiais para o kit.' });
    }
    //console.log(result);
    return res.status(200).json(result); // Retorna o array completo no response
  } catch (error) {
    console.error('Erro ao buscar os dados.', error);
    return res.status(500).json({ message: 'Erro ao buscar os dados.', error });
  }
}
//4. adicionar solicitacao de material didático
export const addSolicitacao = async (req, res) => {
  const solicitacoes = req.body; // Recebe um array de solicitações
  const setor_atual = 'coordenacao';
  const status = 'em andamento';
  try {
    // Valida o token JWT
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }
    // Decodifica o token para obter os dados do usuário
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { userId, nome } = decoded;
    // Itera sobre cada solicitação no array
    for (const solicitacao of solicitacoes) {
      const { cod_produto, descricao, qnt_max, unidade_medida, saldo, qnt_requerida } = solicitacao;
      // Verifica duplicidade
      const [duplicidade] = await db.query(
        `SELECT * FROM solicitacoes WHERE cod_produto = ? AND descricao = ? 
        AND qnt_max = ? AND unidade_medida = ? AND saldo = ? AND qnt_requerida = ? AND setor_atual = ?`,
        [cod_produto, descricao, qnt_max, unidade_medida, saldo, qnt_requerida, setor_atual]
      );
      if (duplicidade.length > 0) {
        return res.status(409).json({
          message: 'Solicitação já enviada.',
        });
      }
      // Gera o número único da solicitação
      const timestamp = new Date().getTime(); // Timestamp único
      const numeroSolicitacao = `${userId}-${nome}-${timestamp}-${cod_produto}`; // Formato: "id-nome-timestamp-cod_produto"
      // Insere a solicitação no banco de dados
      await db.query(
        `INSERT INTO solicitacoes (cod_produto, descricao, qnt_max, unidade_medida, saldo, qnt_requerida, setor_atual, numero_solicitacao, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [cod_produto, descricao, qnt_max, unidade_medida, saldo, qnt_requerida, setor_atual, numeroSolicitacao, status]
      );
    }
    // Retorna sucesso após processar todas as solicitações
    return res.status(201).json({
      message: 'Solicitações cadastradas com sucesso',
    });
  } catch (error) {
    console.error('Erro encontrado:', error);
    return res.status(500).json({ error });
  }
};

//1. Visualizar todas as solicitações
export const todasSolicitacoesDocente = async (req, res) => {
  try {
    //1.
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido' })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { userId, nome } = decoded;
    const result = await db.query(`SELECT cod_produto, descricao, qnt_max, unidade_medida, saldo, qnt_requerida,
       setor_atual, numero_solicitacao, status FROM solicitacoes WHERE numero_solicitacao LIKE ?`, [`${userId}-${nome}%`]);
    if (result.length === 0) {
      return res.status(404).json([]);
    }
    //console.log(result);
    return res.status(200).json(result); // Retorna o array completo no response
  } catch (error) {
    console.error('Erro ao buscar as solicitações.', error);
    return res.status(500).json({ message: 'Erro ao buscar os dados.', error });
  }
}; 
export const todasSolicitacoesDocenteConcluidas = async (req, res) => {
  const status = 'concluída';
  try {
    //1.
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido' })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { userId, nome } = decoded;
    const result = await db.query(`SELECT numero_solicitacao FROM solicitacoes WHERE 
      numero_solicitacao LIKE ? AND status = ?`, [`${userId}-${nome}%`, status]);
    if (result.length === 0) {
      return res.status(404).json([]);
    }
    console.log(result);
    return res.status(200).json(result); // Retorna o array completo no response
  } catch (error) {
    console.error('Erro ao buscar as solicitações.', error);
    return res.status(500).json({ message: 'Erro ao buscar os dados.', error });
  }
};