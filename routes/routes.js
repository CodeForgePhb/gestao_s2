const express = require('express');
const router = express.Router();
const controllerDocente = require('../controllers/routesDocente'); //importa o controlador de transações
const authMiddleware = require('../middleware/authorization')

router.get('/cursos-vigentes', authMiddleware,controllerDocente.buscarCursosVigentes);
router.get('/cursos-concluidos', authMiddleware,controllerDocente.buscarCursosConcluidos);


// router.post('/login', autentication.login); //login
// router.post('/register', autentication.cadastro); //cadastro


//const authMiddleware = require('../middlewares/authMiddleware'); // Importa o middleware de autenticação

// // Rota principal
// router.get('/login', (req, res) => {
//     res.sendFile(path.join(__dirname ,'../public/index.html'))
// });


// router.get('/recebimento', (req, res) => {
//     res.sendFile(path.join(__dirname ,'../public/recebimento.html'))
// });



//Definir uma rota para obter todas as transações
//router.get('/',authMiddleware, transactionsController.getAllTransactions);

//Definir uma rota para adicionar uma nova transação
//router.post('/',authMiddleware, transactionsController.addTransaction);

//Definir uma rota para atualizar uma transação existente (substituição completa)
//router.put('/:id',authMiddleware, transactionsController.updateTransactionTotal);

//Definir uma rota para atualizar uma transação existente (substituição parcial)
//router.patch('/:id',authMiddleware, transactionsController.updateTransactionParcial);

//Definir uma rota para deletar uma transação existente
//router.delete('/:id',authMiddleware, transactionsController.deleteTransaction);

module.exports = router;
