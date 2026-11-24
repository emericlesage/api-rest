const pool = require('../config/database');

const getProducts = async () => {
    const result = await pool.query('SELECT * FROM products');
    return result.rows;
};

const getProductById = async (id) => {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    return result.rows[0];
};

const createProduct = async (product, owner) => {
    const { name, description, price, category } = product;
    const result = await pool.query(
        'INSERT INTO products (name, description, price, category, owner) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, description, price, category, owner]
    );
    return result.rows[0];
};

const updateProduct = async (id, product, user) => {
    const currentProduct = await getProductById(id);
    if (!currentProduct) {
        return null;
    }

    if (user.role === 'Manager' && currentProduct.owner !== user.id) {
        return { forbidden: true };
    }

    const updatedProduct = {
        name: product.name ?? currentProduct.name,
        description: product.description ?? currentProduct.description,
        price: product.price ?? currentProduct.price,
        category: product.category ?? currentProduct.category
    };

    const result = await pool.query(
        'UPDATE products SET name = $1, description = $2, price = $3, category = $4 WHERE id = $5 RETURNING *',
        [updatedProduct.name, updatedProduct.description, updatedProduct.price, updatedProduct.category, id]
    );
    return { product: result.rows[0] };
};

const deleteProduct = async (id) => {
    const result = await pool.query('DELETE FROM products WHERE id = $1', [id]);
    return result.rowCount > 0;
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
