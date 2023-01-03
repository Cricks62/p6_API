const express = require('express');

const app = express();

app.use((req, res) => {
    res.json ({message : 'votre message'});
});

module.exports = app;