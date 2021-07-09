const express = require("express");
const mysql = require('mysql');

const app = express();

app.use(express.static('public'));
app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render("index");
}); 

app.get('/blog', (req, res) => {
    res.render("blog");
});

app.listen(8080 , () => {
    console.log('App listening on port 8080');
});