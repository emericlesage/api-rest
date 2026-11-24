const authService = require('../services/auth.service');

const register = async (req, res) => {
    try {
        res.status(201).json(await authService.register(req.body));
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de l'inscription", details: error.message });
    }
};

const login = async (req, res) => {
    try {
        const token = await authService.login(req.body);
        if (!token) {
            return res.status(401).json({ error: 'Identifiants invalides' });
        }
        res.json({ token, expiresIn: 7200 });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la connexion', details: error.message });
    }
};

module.exports = { register, login };
