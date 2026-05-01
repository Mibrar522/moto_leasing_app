// server/models/userModel.js
const pool = require('../config/db');

class UserModel {
    static async getAll() {
        // Precise join for 'users' and 'roles' tables
        const query = `
            SELECT u.id, u.full_name, u.email, r.role_name, u.is_active 
            FROM users u 
            JOIN roles r ON u.role_id = r.id 
            ORDER BY u.created_at DESC`;
        const result = await pool.query(query);
        return result.rows;
    }
}

module.exports = UserModel;