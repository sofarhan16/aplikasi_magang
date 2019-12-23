const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'warehousenesiaindo@gmail.com',
        pass: 'pjtevhecfhduucms'
    }, 
    tls: {
        rejectUnauthorized: false
    }
})

module.exports = transporter;