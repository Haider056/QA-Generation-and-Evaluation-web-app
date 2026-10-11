const questionModel = require('../Models/questionModel');

// POST /auth/save  { userId, generatedQuestions: [{question, answer}], bookTitle?, chapter? }
async function saveQuestions(req, res) {
    try {
        const { userId, bookTitle, chapter } = req.body;
        const questionsData = req.body.generatedQuestions || (req.body.data && req.body.data.questions) || [];
        if (!userId) return res.status(400).json({ error: 'userId is required' });
        if (!questionsData.length) return res.status(400).json({ error: 'No questions to save' });

        const createdAt = new Date();
        for (const { question, answer } of questionsData) {
            await questionModel.saveQuestion(
                question,
                typeof answer === 'string' ? answer : JSON.stringify(answer),
                createdAt,
                { userId: Number(userId), bookTitle, chapter }
            );
        }
        res.status(201).json({ message: 'Questions saved successfully', count: questionsData.length });
    } catch (error) {
        console.error('Error saving questions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// GET /auth/questions?userId=1  -> { questions: [{id, question, answer, createdAt, bookTitle, chapter}] }
async function listQuestions(req, res) {
    try {
        const userId = Number(req.query.userId);
        if (!userId) return res.status(400).json({ error: 'userId is required' });
        const rows = await questionModel.getQuestionsByUser(userId);
        const questions = rows.map((r) => {
            let answer = r.answer;
            if (typeof answer === 'string' && answer.startsWith('[')) {
                try { answer = JSON.parse(answer); } catch (e) { /* plain text answer */ }
            }
            return { id: r.id, question: r.question, answer, createdAt: r.created_at, bookTitle: r.book_title, chapter: r.chapter };
        });
        res.json({ questions });
    } catch (error) {
        console.error('Error listing questions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { saveQuestions, listQuestions };
