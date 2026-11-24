const express = require('express');
const authController = require('../controllers/auth.controller');
const validateBody = require('../middlewares/validate.middleware');
const { userSchema, loginSchema } = require('../schemas/user.schema');

const router = express.Router();

router.post('/register', validateBody(userSchema), authController.register);
router.post('/login', validateBody(loginSchema), authController.login);

module.exports = router;
