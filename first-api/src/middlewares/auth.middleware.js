const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Accès refusé' });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (error, user) => {
        if (error) {
            return res.status(403).json({ error: 'Token invalide ou expiré' });
        }

        req.user = user;
        next();
    });
};

const verifyRole = (allowedRoles) => (req, res, next) => {
    if (!req.user || !req.user.role || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Accès refusé' });
    }

    next();
};

module.exports = { verifyToken, verifyRole };
