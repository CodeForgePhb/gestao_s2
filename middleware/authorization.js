const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

const autenticarToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).send('Acesso negado. Token ausente.');
    }
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.userId = decoded.id; // Passar o ID do usuário para o próximo middleware
        req.email = decoded.email;
        req.senha = decoded.senha;
        next();
    } catch (err) {
        res.status(400).send('Token inválido ou expirado.');
    }
};

module.exports = autenticarToken;