const express = require('express');
const router = express.Router();
const autentication = require('../controllers/authentication');

router.get('/usuario/setor', autentication.buscarSetor); //buscar setor
router.post('/login', autentication.login); //login
router.post('/cadastro', autentication.cadastro); //cadastro

module.exports = router;
