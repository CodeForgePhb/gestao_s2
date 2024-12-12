const express = require('express');
const db = require('./db'); // Importar a conexão com o banco
const router = express.Router();

// Rota principal
router.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/cadastro.html')
});

router.get('/recebimento', (req, res) => {
    res.sendFile(__dirname + '/public/recebimento.html')
});

//------------------------ROTAS GET

// Rota para buscar cursos
router.get('/cursos', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM curso'); // Consulta no banco
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar dados dos cursos.' });
    }
});
// Rota para buscar docentes
router.get('/docentes', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM professor'); // Consulta no banco
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar dados dos docentes.' });
    }
});

// Rota para buscar kit-didatico
router.get('/kit-didatico', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM kit_didatico'); // Consulta no banco
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar dados dos kit didaticos.' });
    }
});

// rota para buscar kit-produtos
router.get('/kit-produtos', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT* FROM kit_produtos'
        )
        res.json(rows);
    } catch(error) {
        res.status(500).json(
            {error: "Erro ao buscar os dados dos produtos"}
        );
    }
})

//-------------------------------

router.post('/cadastro_usuarios',
    async (req, res) => {
        const { setor } = req.body;
        db.query(
            'SELECT * FROM usuarios WHERE setor = ?', [setor],
            (err, results) => {
                if(err) {
                    console.log('Erro: ', err);
                    res.status(500).send('Erro na rota cadastro');
                }
                res.json(results);
            }
        )
    }
)

//-----------------------------

// router.get('/kit-didatico', async(req, res)=>{
//     db.query(
//         'select * from kit_didatico',
//         (err, results)=>{
//             if(err){
//                 console.error(err)
//                 res.status(500).send('erro ao obter os dados')
//             }
//             res.status(200).send(results)
//         }
//     )
// })


// ROTAS POST

// Rota para inserir cursos
router.post('/cursos', async (req, res) => {
    const { nome_curso, matriculas_previstas, turno, periodo, ch_total, modalidade, financimaento, localidade, turma } = req.body;
    try {
        VALUES
        const [result] = await db.query(`INSERT INTO curso (nome_curso, matriculas_previstas, turno, 
        periodo, ch_total, modalidade, financimaento, localidade, turma) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [nome_curso,
            matriculas_previstas, turno, periodo, ch_total, modalidade, financimaento, localidade, turma]);
        res.status(201).json({
            id: result.insertId, nome_curso, matriculas_previstas, turno,
            periodo, ch_total, modalidade, financimaento, localidade, turma
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao inserir dados do curso.' });
    }
});

// Rota para inserir docentes
router.post('/docentes', async (req, res) => {
    const { matricula, nome, email, telefone, curso_matriculado } = req.body;
    try {
        VALUES
        const [result] = await db.query(`INSERT INTO professor (matricula, nome, email, telefone, curso_matriculado) 
            VALUES (?, ?, ?, ?, ?)`, [matricula, nome, email, telefone, curso_matriculado]);
        res.status(201).json({
            id: result.insertId, matricula, nome, email, telefone, curso_matriculado
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao inserir dados do docente.' });
    }
});

// rota para adicionar kit-didatico

// router.post('/kit-didatico', 
//     async (req, res) => {
//         const {quantidade, curso_vinculado, data_cadastro, tipo, fornecedor} = req.body;

//         try {
//             VALUES

//         }
//     }
// )



module.exports = router;
