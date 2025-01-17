
// const express = require('express');
// const db = require('../db'); // Importar a conexão com o banco
// const router = express.Router();

// import express from 'express';
// import db from '../db'; // Importa a conexão com o banco
// import router from express.Router();


import db from '../config/db.js'; // Importa a conexão com o banco
import jwt from 'jsonwebtoken';


// Função para buscar cursos
export const getCursos = async () => {
    try {
        const [rows] = await db.query('SELECT * FROM curso');  // Consulta no banco
        return rows;
    } catch (error) {
        throw new Error('Erro ao buscar dados dos cursos.');
    }
};

// Função para buscar docentes
export const getDocentes = async () => {
    try {
        const [rows] = await db.query('SELECT * FROM professor');  // Consulta no banco
        return rows;
    } catch (error) {
        throw new Error('Erro ao buscar dados dos docentes.');
    }
};

// Função para buscar kit-didatico
export const getKitDidatico = async () => {
    try {
        const [rows] = await db.query('SELECT * FROM kit_didatico');  // Consulta no banco
        return rows;
    } catch (error) {
        throw new Error('Erro ao buscar dados dos kit didáticos.');
    }
};

// Função para buscar kit-produtos
export const getKitProdutos = async () => {
    try {
        const [rows] = await db.query('SELECT * FROM kit_produtos');
        return rows;
    } catch (error) {
        throw new Error('Erro ao buscar os dados dos produtos.');
    }
};

// Função para cadastro de usuários
export const cadastroUsuarios = async (setor) => {
    try {
        const [results] = await db.query('SELECT * FROM usuarios WHERE setor = ?', [setor]);
        return results;
    } catch (error) {
        throw new Error('Erro na rota cadastro de usuários.');
    }
};

// Função para inserir cursos
export const insertCurso = async (cursoData) => {
    const { nome_curso, matriculas_previstas, turno, periodo, ch_total, modalidade, financimaento, localidade, turma } = cursoData;
    try {
        const [result] = await db.query(
            `INSERT INTO curso (nome_curso, matriculas_previstas, turno, periodo, ch_total, modalidade, financimaento, localidade, turma) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nome_curso, matriculas_previstas, turno, periodo, ch_total, modalidade, financimaento, localidade, turma]
        );
        return {
            id: result.insertId,
            nome_curso,
            matriculas_previstas,
            turno,
            periodo,
            ch_total,
            modalidade,
            financimaento,
            localidade,
            turma
        };
    } catch (error) {
        throw new Error('Erro ao inserir dados do curso.');
    }
};

// Função para inserir docentes
export const insertDocente = async (docenteData) => {
    const { matricula, nome, email, telefone, curso_matriculado } = docenteData;
    try {
        const [result] = await db.query(
            `INSERT INTO professor (matricula, nome, email, telefone, curso_matriculado) 
             VALUES (?, ?, ?, ?, ?)`,
            [matricula, nome, email, telefone, curso_matriculado]
        );
        return {
            id: result.insertId,
            matricula,
            nome,
            email,
            telefone,
            curso_matriculado
        };
    } catch (error) {
        throw new Error('Erro ao inserir dados do docente.');
    }
};

// Função para inserir kit-didatico
// Adicione aqui a lógica para a inserção de kit-didatico, se necessário

// export const verCursosConcluidos = (req, res)=>{
//     const { data1, data2 } = req.body;
//     console.log('Dados recebidos:', { data1, data2 });
//   // Query SQL com um placeholder para evitar SQL Injection
// const query = 
// `SELECT 
//     d.id,
//     d.dado,
//     d.dado2,
//     da.data_aniversario
// FROM 
//     dados d
// JOIN 
//     data_aniversario da
// ON 
//     d.id = da.id_dado
// WHERE 
//     da.data_aniversario BETWEEN ? AND ?;`

//     // Executar a query
//     db.execute(query, [data1, data2], (err, results) => {
//       if (err) {
//         res.status(500).send('Erro ao buscar dados');
//         console.error(err);
        
//       } else {
//         res.json(results);
//       }
//     });
// }

