// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Event = require('./models/Event');  // Import the Event model

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// Set up EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', './views');

// MongoDB Connection
const dbURI = 'mongodb://localhost:27017/Booking-events'; // Use local MongoDB
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes

// Display all events
app.get('/', async (req, res) => {
    try {
        const events = await Event.find(); // Fetch all events
        res.render('index', { events: events });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).send('Error fetching events');
    }
});

// Add a new event
app.post('/add-event', async (req, res) => {
    const { title, description, date } = req.body;

    // Check if all fields are provided
    if (!title || !description || !date) {
        return res.status(400).send('All fields are required!');
    }

    try {
        const newEvent = new Event({ title, description, date });
        await newEvent.save();
        res.redirect('/');
    } catch (error) {
        console.error('Error adding event:', error);
        res.status(500).send('Error adding event');
    }
});


// Delete an event
app.post('/delete-event', async (req, res) => {
    const { eventId } = req.body;
    try {
        await Event.findByIdAndDelete(eventId);
        res.redirect('/');
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).send('Error deleting event');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
