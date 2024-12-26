require('dotenv').config(); // Load environment variables from .env

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const Blog = require("./models/model");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });



// Nodemailer configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
  },
});

app.get('/blogs',async(req,res)=>{
    try {
        const blogs = await Blog.find(); 
        res.status(200).json(blogs); 
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch blogs", details: error.message });
      }
})
app.get('/blogs/:id', async (req, res) => {
    const { id } = req.params;
    console.log("Received ID:", id);
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid ObjectId format");
      return res.status(400).json({ error: 'Invalid Blog ID format' });
    }
  
    try {
      const blog = await Blog.findById(id);
      if (!blog) {
        console.log("Blog not found in database");
        return res.status(404).json({ error: 'Blog not found' });
      }
      console.log("Found blog:", blog);
      res.status(200).json(blog);
    } catch (error) {
      console.error("Error fetching blog:", error.message);
      res.status(500).json({ error: 'Failed to fetch the blog', details: error.message });
    }
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

    if (!name || !number || !message) {
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