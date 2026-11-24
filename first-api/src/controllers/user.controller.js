const userService = require('../services/user.service');

const updateRole = async (req, res) => {
    try {
        const updated = await userService.updateRole(req.params.id, req.body.role);
        if (!updated) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        res.status(200).json({ message: 'Rôle mis à jour avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du rôle' });
    }
};

module.exports = { updateRole };
