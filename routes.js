const express = require('express');
const db = require('./db'); // Importar a conexão com o banco
const router = express.Router();

// Rota principal
router.get('/', (req, res) => {
    res.send('Servidor rodando.');
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

// Rota para buscar cursos
router.get('/cursos', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM curso'); // Consulta no banco
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar dados dos cursos.' });
    }
});

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

module.exports = router;
