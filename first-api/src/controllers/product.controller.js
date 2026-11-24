const productService = require('../services/product.service');

const getProducts = async (req, res) => {
    try {
        res.json(await productService.getProducts());
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des produits', details: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération du produit', details: error.message });
    }
};

const createProduct = async (req, res) => {
    try {
        const product = await productService.createProduct(req.body, req.user.id);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création du produit', details: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const result = await productService.updateProduct(req.params.id, req.body, req.user);
        if (!result) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }
        if (result.forbidden) {
            return res.status(403).json({ error: 'Accès refusé : vous ne pouvez modifier que vos propres articles' });
        }

        res.json(result.product);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du produit', details: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const deleted = await productService.deleteProduct(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression du produit', details: error.message });
    }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
