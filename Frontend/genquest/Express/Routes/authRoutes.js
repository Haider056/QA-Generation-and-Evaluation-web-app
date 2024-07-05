const express=require('express')
const authController = require('../controllers/authController');
const saveQuestions  = require('../Controllers/questionController');
const router = express.Router();
// Route to save a question and answer
router.post('/save', saveQuestions.saveQuestions);
const isLoggedIn = (req, res, next) => {
  if (req.session.isLoggedIn) {
    next(); 
  } else {
    console.log('Unauthorized access attempt to protected route'); 
    res.status(401).json({ message: 'Unauthorized: Please log in' });
  }
};

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.use(isLoggedIn); 

router.post('/logout', authController.logout);
router.post('/resetPassword', authController.resetPassword);

module.exports = router;
