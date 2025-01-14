// const express = require('express');
// const router = express.Router();
// const controllerDocente = require('../controllers/docente'); //importa o controlador de transações
// const controllerCoordenacao = require('../controllers/coordenacao'); //importa o controlador de transações
// const authMiddleware = require('../middleware/authorization')

import express from 'express';
import * as controllerDocente from '../controllers/docente.js'; // Importa todas as funções exportadas no arquivo
import * as controllerCoordenacao from '../controllers/coordenacao.js';
import authMiddleware from '../middleware/authorization.js'; // Importa o middleware

const router = express.Router();

//----------------Coordenação------------------------------------------------------------------------------------------
router.post('/add-curso', authMiddleware,controllerCoordenacao.addCurso);
router.post('/add-docente', authMiddleware,controllerCoordenacao.addDocente);
router.get('/docentes', authMiddleware,controllerCoordenacao.buscarDocentes);
router.get('/cursos', authMiddleware,controllerCoordenacao.buscarCursos);
router.get('/all-cursos-vigentes', authMiddleware,controllerCoordenacao.buscarCursosVigentes);
router.get('/cursos-concluidos', authMiddleware,controllerCoordenacao.buscarCursosConcluidos);
router.delete('/docente/:id', authMiddleware,controllerCoordenacao.delDocente);
router.delete('/curso-vigente/:id_curso', authMiddleware,controllerCoordenacao.delCursoVigente);

//----------------Docente----------------------------------------------------------------------------------------------
router.get('/cursos-vigentes', authMiddleware,controllerDocente.buscarCursosVigentes);
// router.get('/cursos-concluidos', authMiddleware,controllerDocente.buscarCursosConcluidos);
router.get('/solicitacao-kit', authMiddleware,controllerDocente.TodasSolicitacoes);

// module.exports = router;

export default router; // Exporta o roteador como padrão