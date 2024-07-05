const express = require('express');
const session = require('express-session');
const authRoutes = require('./Routes/authRoutes');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true,
}));



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'genquest',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));



app.get('/heartbeat', (req, res) => {
  res.status(200).send('OK');
});
app.use('/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
