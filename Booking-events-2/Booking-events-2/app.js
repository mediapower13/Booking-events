const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Event = require('./models/Event');

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'BOOKING-EVENTS-2')));

// MongoDB Connection
const dbURI = 'mongodb://localhost:27017/Booking-events';
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API to get all events as JSON
app.get('/api/events', async (req, res) => {
    try {
        const events = await Event.find(); // Fetch all events
        res.json(events); // Send events as JSON data
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).send('Error fetching events');
    }
});

// Add a new event
app.post('/add-event', async (req, res) => {
    const { title, description, date } = req.body;

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
