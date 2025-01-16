const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const path = require('path');
const app = express();
const port = 3000;

// Twilio credentials
const accountSid = 'your_account_sid';
const authToken = 'your_auth_token';
const client = new twilio(accountSid, authToken);

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
            pass: 'your-app-password' // Use the App Password generated from Google
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
            return res.status(500).send('Error occurred: ' + error.message);
        }

        // Send SMS using Twilio
        client.messages.create({
            body: `New message from ${name} (${email}): ${message}`,
            from: '+1234567890', // Your Twilio phone number
            to: '+0987654321' // Your phone number
        }).then(message => console.log('SMS sent: ' + message.sid))
          .catch(error => console.error('Error sending SMS:', error));

        res.status(200).send('Message sent: ' + info.response);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});