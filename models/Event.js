// models/Event.js
const mongoose = require('mongoose');

// Define the schema for an event
const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});

// Create the model
module.exports = mongoose.model('Event', eventSchema, 'events');
