const mysql = require('mysql2/promise');
require('dotenv').config();

class QuestionModel {
    constructor() {
        this.pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '1234',
            database: process.env.DB_NAME || 'genquest',
        });
    }

    async saveQuestion(question, answer, createdAt = new Date()) {
        try {
            console.log('Saving question to the database:', { question, answer, createdAt });
            const [result] = await this.pool.execute(
                'INSERT INTO genquestions (question, answer, created_at) VALUES (?, ?, ?)',
                [question, answer, createdAt]
            );

            if (result && result.insertId) {
                console.log('Question saved successfully. Question ID:', result.insertId);
                return result.insertId;
            } else {
                console.error('Failed to save question');
                throw new Error('Failed to save question');
            }
        } catch (error) {
            console.error('Error saving question:', error);
            throw error;
        }
    }
}

module.exports = new QuestionModel();
