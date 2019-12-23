const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
//const mysql = require('mysql');
const conn = require('./database');
var fs = require('fs');
var http = require('http');
var https = require('https');

var app = express({defaultErrorHandler:false});

var port = process.env.PORT || 1997;

app.use(cors())
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req,res) => {
    res.send('<h1>Selamat Datang di API!</h1>')
})
setInterval(()=> {
    conn.query('SELECT 1');
}, 5000);
const { authRouter, productRouter, transactionRouter,customerRouter } = require('./routers');

app.use('/auth', authRouter);
app.use('/product', productRouter);
app.use('/transaction', transactionRouter);
app.use('/customer',customerRouter);
// app.use(bodyParser.json({limit: '50mb'}));
// app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

var httpServer = http.createServer(app);

httpServer.listen(port, () => console.log('API Aktif di port ' + port))