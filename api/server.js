const express = require('express');
const mysql = require('mysql');
const app = express();
const port = process.env.PORT || 3300;

app.use(express.json());

require('./routes/tasks')(app);

app.listen(port, function() {
    console.log(`App running? on port ${port}`);
});