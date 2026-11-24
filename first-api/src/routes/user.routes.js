const express = require('express');
const userController = require('../controllers/user.controller');
const { verifyToken, verifyRole } = require('../middlewares/auth.middleware');
const validateBody = require('../middlewares/validate.middleware');
const { roleSchema } = require('../schemas/user.schema');

const router = express.Router();

router.patch('/:id/role', verifyToken, verifyRole(['Administrateur']), validateBody(roleSchema), userController.updateRole);

module.exports = router;
