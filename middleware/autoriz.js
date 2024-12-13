const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

const autenticarToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Acesso negado. Token ausente.' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.userId = decoded.id; // Passar o ID do usuário para o próximo middleware
        next();
    } catch (error) {
        res.status(403).json({ error: 'Token inválido ou expirado.' });
    }
};

module.exports = autenticarToken;
