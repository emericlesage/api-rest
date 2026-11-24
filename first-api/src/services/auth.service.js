const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const register = async ({ firstname, lastname, email, password }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
        'INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING id, firstname, lastname, email',
        [firstname, lastname, email, hashedPassword]
    );
    return result.rows[0];
};

const login = async ({ email, password }) => {
    const result = await pool.query(
        `SELECT users.*, roles.name AS role_name
            FROM users
            LEFT JOIN roles ON users.role_id = roles.id
            WHERE users.email = $1`,
        [email]
    );

    if (result.rows.length === 0) {
        return null;
    }

    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        return null;
    }

    return jwt.sign(
        { id: user.id, role: user.role_name },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '2h' }
    );
};

module.exports = { register, login };
