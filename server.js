const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');
const pageRoutes = require('./routes/pageRoutes');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use('/style', express.static(path.join(__dirname, 'public/style')));
app.use('/script', express.static(path.join(__dirname, 'public/script')));

// Routes
app.use('/', pageRoutes);
app.use('/', authRoutes);
app.use('/', quizRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});