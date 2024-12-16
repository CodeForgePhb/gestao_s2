const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

const autenticarToken = (req, res, next) => {

    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).send('Acesso negado. Token ausente.');
    }
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.userId = decoded.userId; // Passar o ID do usuário para o próximo middleware
        req.email = decoded.email;
        req.setor = decoded.setor;
        
        next();
    } catch (err) {
        console.error('Erro ao verificar token:', err);
        res.status(401).send('Token inválido ou expirado.');
    }
};

module.exports = autenticarToken;