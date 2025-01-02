const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
const app = express();
const port = 3000;

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname)));

// Endpoint to handle form submissions
app.post('/send', (req, res) => {
    const { name, email, message } = req.body;

    // Configure the email transport using the default SMTP transport and a GMail account.
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'adeyekunadelola2009@gmail.com',
            pass: 'fedg izvj fnrv pfgz' // Use the App Password generated from Google
        }
    });

    const mailOptions = {
        from: email,
        to: 'adeyekunadelola2009@gmail.com',
        subject: `New message from ${name}`,
        text: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error occurred:', error);
            return res.status(500).sendFile(path.join(__dirname, 'error.html'));
        }
        res.status(200).sendFile(path.join(__dirname, 'success.html'));
    });
});

// Start the server and listen on all network interfaces
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}/`);
});