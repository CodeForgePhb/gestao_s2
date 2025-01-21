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
router.delete('/docente/:id', authMiddleware,controllerCoordenacao.delDocente);
router.get('/cursos-concluidos', authMiddleware,controllerCoordenacao.buscarCursosConcluidos); 

router.delete('/curso-vigente/:id_curso', authMiddleware,controllerCoordenacao.delCursoVigente);
router.post('/adicionar-kit', authMiddleware,controllerCoordenacao.Adicionar_kit);


//----------------Docente----------------------------------------------------------------------------------------------
router.post('/buscar-por-data', authMiddleware,controllerDocente.buscarCursosConcluidos);
router.get('/carregar-cursos-concluidos', authMiddleware,controllerDocente.carregarCursosConcluídos);
router.post('/buscar-por-pesquisa', authMiddleware,controllerDocente.buscarCursosConcluidosPorPesquisa);
router.get('/cursos-vigentes', authMiddleware,controllerDocente.buscarCursosVigentes);
router.get('/cursos-concluidos', authMiddleware,controllerDocente.buscarCursosConcluidos);


router.get('/solicitacao-kit', authMiddleware,controllerDocente.TodasSolicitacoes);
router.get('/kit-didatico-curso', authMiddleware, controllerDocente.TodosKits);
router.get('/materiais-kit-didatico', authMiddleware, controllerDocente.TodosMateriais)





//=-=-==-=-=-=-==-== GESTÃO -=-=-=--===-=-=-======-=-=-=--=



export default router; // Exporta o roteador como padrão