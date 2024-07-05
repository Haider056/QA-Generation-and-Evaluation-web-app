const questionModel = require('../Models/questionModel');

async function saveQuestions(req, res) {
    try {
        const userId = req.body.userId; // Assuming userId is provided in the request body
        const questionsData = req.body.data.questions; // Extract questions data from the request body
        console.log('Received request to save questions:', questionsData);

        // Iterate over each question-answer pair
        for (const { question, answer } of questionsData) {
            // Save each question-answer pair to the database along with the timestamp
            await questionModel.saveQuestion(question, answer);
        }

        console.log('Questions saved successfully');
        res.status(201).json({ message: 'Questions saved successfully' });
    } catch (error) {
        console.error('Error saving questions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { saveQuestions };
