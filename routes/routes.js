// const express = require('express');
// const router = express.Router();
// const controllerDocente = require('../controllers/docente'); //importa o controlador de transações
// const controllerCoordenacao = require('../controllers/coordenacao'); //importa o controlador de transações
// const authMiddleware = require('../middleware/authorization')

import express from 'express';
import * as controllerDocente from '../controllers/docente.js'; // Importa todas as funções exportadas no arquivo
import * as controllerCoordenacao from '../controllers/coordenacao.js';
import * as controllerGestao from '../controllers/gestao.js';
import * as controllerCompras from '../controllers/setorCompras.js';
import authMiddleware from '../middleware/authorization.js'; // Importa o middleware

const router = express.Router();

//----------------Coordenação-----------------------------------------

router.get('/docentes', authMiddleware,controllerCoordenacao.buscarDocentes);//
router.get('/cursos', authMiddleware,controllerCoordenacao.buscarCursos);//
router.get('/cursos-concluidos', authMiddleware,controllerCoordenacao.buscarCursosConcluidos); 
router.get('/buscar-kits', authMiddleware,controllerCoordenacao.buscarKitCoordenacao);
router.get('/all-cursos-vigentes', authMiddleware,controllerCoordenacao.buscarCursosVigentes);
router.get('/solicitacoes-status-em-andamento', controllerCoordenacao.buscarSolicitacaoEmAndamento);
router.get('/solicitacoes-encaminhada', controllerCoordenacao.buscarSolicitacaoEncaminhada);

router.post('/add-curso', authMiddleware,controllerCoordenacao.addCurso);
router.post('/add-docente', authMiddleware,controllerCoordenacao.addDocente);
router.post('/add-kit', authMiddleware,controllerCoordenacao.adicionar_kit);
router.post('/add-material', authMiddleware,controllerCoordenacao.addMateriais);

router.delete('/curso-vigente/:id_curso', authMiddleware,controllerCoordenacao.delCursoVigente);
router.delete('/docente/:id', authMiddleware,controllerCoordenacao.delDocente);
router.put('/updt-setor', authMiddleware,controllerCoordenacao.atualizarSetorDaSolicitacao);

//----------------Docente----------------------------------------------------------------------------------------------
router.get('/cursos-vigentes', authMiddleware,controllerDocente.buscarCursosVigentes);
router.get('/cursos-concluidos', authMiddleware,controllerDocente.buscarCursosConcluidos);
router.get('/carregar-cursos-concluidos', authMiddleware,controllerDocente.carregarCursosConcluídos);
router.get('/buscar-solicitacoes-docente', authMiddleware, controllerDocente.todasSolicitacoesDocente);
router.get('/buscar-solicitacoes-docente-concluidas', authMiddleware, controllerDocente.todasSolicitacoesDocenteConcluidas);

router.post('/buscar-por-pesquisa', authMiddleware,controllerDocente.buscarCursosConcluidosPorPesquisa);
router.post('/buscar-por-data', authMiddleware,controllerDocente.buscarCursosConcluidos);
router.post('/kit-didatico-curso', authMiddleware, controllerDocente.todosKits);
router.post('/materiais-kit-didatico', authMiddleware, controllerDocente.todosMateriais);
router.post('/dados-curso', authMiddleware, controllerDocente.dadosCursoClicado);
router.post('/adicionar-solicitacao', authMiddleware, controllerDocente.addSolicitacao);




//=-=-==-=-=-=-==-== GESTÃO -=-=-=--===-=-=-=====-=-=-=--=

router.get('/buscar-solicitacoes-gestao', authMiddleware, controllerGestao.buscarSolicitacaoEmAndamentoGestao);
//router.get('/buscar-solicitacoes-gestao-concluidas', authMiddleware, controllerGestao.buscarSolicitacaoEncaminhada);
router.put('/updt-setor-compras', authMiddleware,controllerCoordenacao.atualizarSetorDaSolicitacao);

//-------------Setor de compras------------

router.get('/solicitacoes-compras', controllerCompras.buscarSolicitacaoEmAndamentoCompras);
router.get('/todos-cursos', controllerCompras.buscarCursosCompras);


export default router; // Exporta o roteador como padrão