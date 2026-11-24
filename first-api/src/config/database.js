require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER || 'user',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'apidb',
    port: Number(process.env.DB_PORT) || 5434,
    password: process.env.DB_PASSWORD || 'password'
});

module.exports = pool;
