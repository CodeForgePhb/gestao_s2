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

      // 3. Consulta SQL para buscar o setor do usuário
      const [result] = await db.query('SELECT nome_usuario FROM usuarios WHERE nome = ?', [email]);
  
      if (result.length === 0) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }
  
      // 4. Retorna o setor do usuário
      const { nome_usuario } = result[0]; // Desestrutura o setor da resposta do banco
      res.status(200).json({ nome_usuario });
    } catch (err) {
      console.error('Erro ao buscar setor do usuário:', err);
      res.status(500).json({ message: 'Erro no servidor.' });
    }
  };
  

// const buscarCursos = (req, res)=>{
//     const {professor} = req.body

//     db.query(
//         'SELECT nome_curso FROM cursos_vigentes where professor=?',[professor],
//         (err, results)=>{
//             if(err){
//                 console.error('Erro ao obter dado cursos vigentes',err)
//                 res.status(500).send('Erro ao obter dado cursos vigentes')
//                 return
//             }
//             res.json({results})
//             console.log(results)
//         }
//     )
// }

const buscarCursos = async (req, res) => {
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
  


// // Rota para buscar cursos
// router.get('/cursos', async (req, res) => {
//     try {
//         const [rows] = await db.query('SELECT * FROM curso'); // Consulta no banco
//         res.json(rows);
//     } catch (error) {
//         res.status(500).json({ error: 'Erro ao buscar dados dos cursos.' });
//     }
// });
// // Rota para buscar docentes
// router.get('/docentes', async (req, res) => {
//     try {
//         const [rows] = await db.query('SELECT * FROM professor'); // Consulta no banco
//         res.json(rows);
//     } catch (error) {
//         res.status(500).json({ error: 'Erro ao buscar dados dos docentes.' });
//     }
// });

// // Rota para buscar kit-didatico
// router.get('/kit-didatico', async (req, res) => {
//     try {
//         const [rows] = await db.query('SELECT * FROM kit_didatico'); // Consulta no banco
//         res.json(rows);
//     } catch (error) {
//         res.status(500).json({ error: 'Erro ao buscar dados dos kit didaticos.' });
//     }
// });

// // rota para buscar kit-produtos
// router.get('/kit-produtos', async (req, res) => {
//     try {
//         const [rows] = await db.query(
//             'SELECT* FROM kit_produtos'
//         )
//         res.json(rows);
//     } catch(error) {
//         res.status(500).json(
//             {error: "Erro ao buscar os dados dos produtos"}
//         );
//     }
// })

// //-------------------------------

// router.post('/cadastro_usuarios',
//     async (req, res) => {
//         const { setor } = req.body;
//         db.query(
//             'SELECT * FROM usuarios WHERE setor = ?', [setor],
//             (err, results) => {
//                 if(err) {
//                     console.log('Erro: ', err);
//                     res.status(500).send('Erro na rota cadastro');
//                 }
//                 res.json(results);
//             }
//         )
//     }
// )

// //-----------------------------



// // ROTAS POST

// // Rota para inserir cursos
// router.post('/cursos', async (req, res) => {
//     const { nome_curso, matriculas_previstas, turno, periodo, ch_total, modalidade, financimaento, localidade, turma } = req.body;
//     try {
//         VALUES
//         const [result] = await db.query(`INSERT INTO curso (nome_curso, matriculas_previstas, turno, 
//         periodo, ch_total, modalidade, financimaento, localidade, turma) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [nome_curso,
//             matriculas_previstas, turno, periodo, ch_total, modalidade, financimaento, localidade, turma]);
//         res.status(201).json({
//             id: result.insertId, nome_curso, matriculas_previstas, turno,
//             periodo, ch_total, modalidade, financimaento, localidade, turma
//         });
//     } catch (error) {
//         res.status(500).json({ error: 'Erro ao inserir dados do curso.' });
//     }
// });

// // Rota para inserir docentes
// router.post('/docentes', async (req, res) => {
//     const { matricula, nome, email, telefone, curso_matriculado } = req.body;
//     try {
//         VALUES
//         const [result] = await db.query(`INSERT INTO professor (matricula, nome, email, telefone, curso_matriculado) 
//             VALUES (?, ?, ?, ?, ?)`, [matricula, nome, email, telefone, curso_matriculado]);
//         res.status(201).json({
//             id: result.insertId, matricula, nome, email, telefone, curso_matriculado
//         });
//     } catch (error) {
//         res.status(500).json({ error: 'Erro ao inserir dados do docente.' });
//     }
// });

// // rota para adicionar kit-didatico

// // router.post('/kit-didatico', 
// //     async (req, res) => {
// //         const {quantidade, curso_vinculado, data_cadastro, tipo, fornecedor} = req.body;

// //         try {
// //             VALUES

// //         }
// //     }
// //

 module.exports = {
    buscarNome,
    buscarCursos
 }

