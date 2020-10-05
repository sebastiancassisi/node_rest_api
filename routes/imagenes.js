var express = require('express');

var app = express();

const path = require('path');
const fs = require('fs');

app.get('/:tipo/:imagen', (req, res, next) => {

    var tipo = req.params.tipo;
    var img = req.params.imagen;

    var pathImage = path.resolve(__dirname, `../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImage)) {
        res.sendFile(pathImage);
    } else {
        var pathNoImage = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoImage);
    }

});

module.exports = app;