require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.port || 3000;
const routes = require('./routes');

app.use(express.urlencoded({ extended: false }));

app.use('/', routes);

app.listen(port, () => {
    console.log('App listening on port: ' + port)
})