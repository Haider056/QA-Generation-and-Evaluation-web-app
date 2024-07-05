const mysql = require('mysql2/promise');
require('dotenv').config();

class UserModel {
  constructor() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '1234',
      database: process.env.DB_NAME || 'genquest',
    });
  }

  async createUser(name, email, password) {
    try {
      if (!name || !email || !password ) {
        throw new Error('All parameters must be defined');
      }
  
      const [result] = await this.pool.execute(
        'INSERT INTO genusers (name, email, password) VALUES (?, ?, ?)',
        [name, email, password]
      );
  
      if (result && result.insertId) {
        return result.insertId;
      } else {
        throw new Error('Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getUserByEmail(email) {
    const [users] = await this.pool.execute('SELECT * FROM genusers WHERE email = ?', [email]);
    return users[0] || null;
  }

  async getUserRole(email) {
    try {
      const [users] = await this.pool.execute('SELECT id FROM genusers WHERE email = ?', [email]);
  
      if (!users || users.length === 0) {
        throw new Error(`No user found with email: ${email}`);
      }
  
      return users[0];
    } catch (error) {
      console.error('Error fetching user role:', error);
      throw error;
    }
  }

  async updateUserPassword(email, newPassword) {
    try {
      await this.pool.execute('UPDATE genusers SET password = ? WHERE email = ?', [newPassword, email]);
    } catch (error) {
      console.error('Error updating genusers password:', error);
      throw error;
    }
  }
}

module.exports = new UserModel();
