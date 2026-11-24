const express = require('express');
const productController = require('../controllers/product.controller');
const { verifyToken, verifyRole } = require('../middlewares/auth.middleware');
const validateBody = require('../middlewares/validate.middleware');
const { productSchema, productUpdateSchema } = require('../schemas/product.schema');

const router = express.Router();
const authenticatedRoles = ['Client', 'Manager', 'Administrateur'];
const managementRoles = ['Manager', 'Administrateur'];

router.get('/', verifyToken, verifyRole(authenticatedRoles), productController.getProducts);
router.get('/:id', verifyToken, verifyRole(authenticatedRoles), productController.getProductById);
router.post('/', verifyToken, verifyRole(managementRoles), validateBody(productSchema), productController.createProduct);
router.patch('/:id', verifyToken, verifyRole(managementRoles), validateBody(productUpdateSchema), productController.updateProduct);
router.delete('/:id', verifyToken, verifyRole(['Administrateur']), productController.deleteProduct);

module.exports = router;
