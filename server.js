"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var app = express();
app.get('/', function (req, res) {
    res.redirect("/index.html");
});

app.use(express.static("."));
app.listen(3000);
