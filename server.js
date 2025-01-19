const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
const app = express();
const port = 3000;

// Load environment variables from a .env file
require('dotenv').config();

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to handle form submissions
app.post('/send', (req, res) => {
    const { name, email, message } = req.body;

    // Configure the email transport using the default SMTP transport and a GMail account.
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.adeyekunadelola2009,
            pass: process.env.GMAIL_PASS // Use the App Password generated from Google
        }
    });

    // Email options
    const mailOptions = {
        from: email,
        to: process.env.adeyekunadelola2009,
        subject: `Message from ${name}`,
        text: message
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send('Error sending email');
        }
        console.log('Email sent:', info.response);
        res.status(200).send('Message sent successfully');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});