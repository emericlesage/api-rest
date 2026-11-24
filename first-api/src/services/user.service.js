const pool = require('../config/database');

const updateRole = async (userId, roleId) => {
    const user = await pool.query('SELECT id FROM users WHERE id = $1', [userId]);
    if (user.rows.length === 0) {
        return false;
    }

    await pool.query('UPDATE users SET role_id = $1 WHERE id = $2', [roleId, userId]);
    return true;
};

module.exports = { updateRole };
