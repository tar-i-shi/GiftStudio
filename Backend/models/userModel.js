const pool = require("../config/db");
// Check if a user already exists by email
const findUserByEmail = async (email) => {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0];
};

// Create a new user
const createUser = async (name, email, hashedPassword) => {
    const result = await pool.query(
        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
        [name, email, hashedPassword]
    );
    return result.rows[0];
};

// Find user by ID (useful for protected routes, etc.)
const findUserById = async (id) => {
    const result = await pool.query("SELECT id, name, email FROM users WHERE id = $1", [id]);
    return result.rows[0];
};

module.exports = {
    findUserByEmail,
    createUser,
    findUserById,
};
