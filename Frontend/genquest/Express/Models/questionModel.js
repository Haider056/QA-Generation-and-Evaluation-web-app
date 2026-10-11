const mysql = require('mysql2/promise');
require('dotenv').config();

class QuestionModel {
    constructor() {
        // MySQL by default; set DB_DRIVER=sqlite to run locally without a MySQL server.
        this.pool = process.env.DB_DRIVER === 'sqlite'
          ? require('../Src/Config/sqlitePool')
          : mysql.createPool({
              host: process.env.DB_HOST || 'localhost',
              user: process.env.DB_USER || 'root',
              password: process.env.DB_PASSWORD || '1234',
              database: process.env.DB_NAME || 'genquest',
            });
    }

    async saveQuestion(question, answer, createdAt = new Date(), meta = {}) {
        const [result] = await this.pool.execute(
            'INSERT INTO genquestions (question, answer, created_at, user_id, book_title, chapter) VALUES (?, ?, ?, ?, ?, ?)',
            [question, answer, createdAt, meta.userId ?? null, meta.bookTitle ?? null, meta.chapter ?? null]
        );
        if (!result || !result.insertId) throw new Error('Failed to save question');
        return result.insertId;
    }

    async getQuestionsByUser(userId) {
        const [rows] = await this.pool.execute(
            'SELECT id, question, answer, created_at, book_title, chapter FROM genquestions WHERE user_id = ? ORDER BY created_at DESC, id ASC',
            [userId]
        );
        return rows;
    }
}

module.exports = new QuestionModel();
