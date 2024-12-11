const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

// Initialize Express app
const app = express();
app.use(express.json());
app.use(cors());

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'apicheck11@gmail.com',
        pass: 'xjex rlsk vjvj ybne',
    },
});

app.post('/submitContactForm',async(req,res)=>{

    const { name, number, city, message } = req.body;

    if (!name || !number || !city) {
        return res.status(400).json({ error: 'All required fields must be filled.' });
    }

    const mailOptions = {
        from: 'apicheck11@gmail.com',
        to: 'manyrishabh@gmail.com',
        subject: 'New Lead from DholeraNagri.com',
        text: `Name: ${name}\nContact Number: ${number}\nCity: ${city}\nMessage: ${message}`,
        html: `
            <h3>Contact Form Submission</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Contact Number:</strong> ${number}</p>
            <p><strong>City:</strong> ${city}</p>
            <p><strong>Message:</strong> ${message}</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Form submitted successfully and email sent.' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email.' });
    }


})
app.post('/submitPopUp', async (req, res) => {
    const { name, number, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Email content
    const mailOptions = {
        from: 'apicheck11@gmail.com', 
        to: 'manyrishabh@gmail.com', 
        subject: 'New Lead from DholeraNagri.com Form Submission',
        text: `You have a Lead form submission:\n\nName: ${name}\nPhn no: ${number}\nMessage: ${message}`,
        html: `
            <h3>New Form Submission</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Contact Number:</strong> ${number}</p>
            <p><strong>Message:</strong> ${message}</p>
        `,
    };

    try {
        // Send email
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});



app.listen(3001,()=>{
    console.log(`Listening at port http://localhost:3001`)
})