const express = require('express');
const bodyParser = require('body-parser');
const setAuthRoutes = require('./routes/authRoutes');
const setExpenseRoutes = require('./routes/expenseRoutes');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

setAuthRoutes(app);
setExpenseRoutes(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});