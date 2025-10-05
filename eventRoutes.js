const express = require('express');
const router = express.Router();
const Event = require('./Event');
const EventRegistration = require('./EventRegistration');
const { body, validationResult } = require('express-validator');
const mockData = require('./mockData');
const mongoose = require('mongoose');

// Helper function to check if MongoDB is connected
const isMongoConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Middleware to check if user is admin (you can implement proper auth later)
const isAdmin = (req, res, next) => {
  // For now, we'll skip auth check. In production, implement proper JWT verification
  next();
};

// Get all events
router.get('/', async (req, res) => {
  try {
    if (isMongoConnected()) {
      const events = await Event.find({ isActive: true }).sort({ createdAt: -1 });
      res.json(events);
    } else {
      // Use mock data when MongoDB is not connected
      console.log('Using mock data - MongoDB not connected');
      const events = mockData.getEvents();
      res.json(events);
    }
  } catch (error) {
    console.error('Error fetching events:', error);
    // Fallback to mock data on error
    const events = mockData.getEvents();
    res.json(events);
  }
});

// Get single event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// Create new event (Admin only)
router.post('/', isAdmin, [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('date').notEmpty().withMessage('Date is required'),
  body('time').notEmpty().withMessage('Time is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const eventData = {
      ...req.body,
      createdBy: req.body.createdBy || 'admin' // In production, get from JWT token
    };

    if (isMongoConnected()) {
      const event = new Event(eventData);
      await event.save();
      res.status(201).json({ message: 'Event created successfully', event });
    } else {
      // Use mock data when MongoDB is not connected
      console.log('Creating event in mock data - MongoDB not connected');
      const event = mockData.addEvent(eventData);
      res.status(201).json({ message: 'Event created successfully (mock data)', event });
    }
  } catch (error) {
    console.error('Error creating event:', error);
    // Fallback to mock data on error
    const event = mockData.addEvent(req.body);
    res.status(201).json({ message: 'Event created successfully (fallback to mock data)', event });
  }
});

// Update event (Admin only)
router.put('/:id', isAdmin, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json({ message: 'Event updated successfully', event });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// Delete event (Admin only)
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    // Also delete all registrations for this event
    await EventRegistration.deleteMany({ eventId: req.params.id });
    
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

// Get event registrations (Admin only)
router.get('/:id/registrations', isAdmin, async (req, res) => {
  try {
    const registrations = await EventRegistration.find({ eventId: req.params.id })
      .sort({ registrationDate: -1 });
    
    res.json(registrations);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});

// Get all registrations across all events (Admin only)
router.get('/admin/all-registrations', isAdmin, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const registrations = await EventRegistration.find()
        .populate('eventId', 'title date time venue')
        .sort({ registrationDate: -1 });
      res.json(registrations);
    } else {
      // Use mock data when MongoDB is not connected
      console.log('Using mock data for registrations - MongoDB not connected');
      const registrations = mockData.getRegistrations();
      res.json(registrations);
    }
  } catch (error) {
    console.error('Error fetching all registrations:', error);
    // Fallback to mock data on error
    const registrations = mockData.getRegistrations();
    res.json(registrations);
  }
});

// Register for event
router.post('/:id/register', [
  body('registrantName').notEmpty().withMessage('Name is required'),
  body('registrantEmail').isEmail().withMessage('Valid email is required'),
  body('registrantPhone').notEmpty().withMessage('Phone is required'),
  body('registrantClass').notEmpty().withMessage('Class is required'),
  body('registrantRollNo').notEmpty().withMessage('Roll number is required'),
  body('registrantPRN').notEmpty().withMessage('PRN is required')
], async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const eventId = req.params.id;
    const { registrantEmail } = req.body;

    console.log('Looking for event with ID:', eventId);

    if (isMongoConnected()) {
      // MongoDB version
      const event = await Event.findById(eventId);
      if (!event) {
        console.log('Event not found:', eventId);
        return res.status(404).json({ error: 'Event not found' });
      }
      
      if (!event.isActive) {
        console.log('Event is inactive:', eventId);
        return res.status(400).json({ error: 'Event is currently inactive' });
      }

      const existingRegistration = await EventRegistration.findOne({
        eventId: eventId,
        registrantEmail: registrantEmail
      });

      if (existingRegistration) {
        console.log('User already registered:', registrantEmail);
        return res.status(400).json({ error: 'You are already registered for this event' });
      }

      const currentRegistrations = await EventRegistration.countDocuments({ eventId: eventId });
      if (currentRegistrations >= event.maxParticipants) {
        console.log('Event is full:', eventId);
        return res.status(400).json({ error: 'Event is full' });
      }

      const registrationData = {
        eventId: eventId,
        eventTitle: event.title,
        ...req.body
      };

      const registration = new EventRegistration(registrationData);
      await registration.save();

      res.status(201).json({ 
        message: 'Registration successful', 
        registrationId: registration._id 
      });
    } else {
      // Mock data version
      console.log('Using mock data for registration - MongoDB not connected');
      const events = mockData.getEvents();
      const event = events.find(e => e._id === eventId);
      
      if (!event) {
        console.log('Event not found in mock data:', eventId);
        return res.status(404).json({ error: 'Event not found' });
      }

      const registrations = mockData.getRegistrations();
      const existingRegistration = registrations.find(r => 
        r.eventId === eventId && r.registrantEmail === registrantEmail
      );

      if (existingRegistration) {
        console.log('User already registered:', registrantEmail);
        return res.status(400).json({ error: 'You are already registered for this event' });
      }

      const registrationData = {
        eventId: eventId,
        eventTitle: event.title,
        ...req.body
      };

      const registration = mockData.addRegistration(registrationData);
      res.status(201).json({ 
        message: 'Registration successful (mock data)', 
        registrationId: registration._id 
      });
    }
  } catch (error) {
    console.error('Error registering for event:', error);
    // Fallback to mock data on error
    const registration = mockData.addRegistration({
      eventId: req.params.id,
      eventTitle: 'Unknown Event',
      ...req.body
    });
    res.status(201).json({ 
      message: 'Registration successful (fallback to mock data)', 
      registrationId: registration._id 
    });
  }
});

// Update registration status (Admin only)
router.put('/registrations/:registrationId/status', isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'approved', 'rejected'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const registration = await EventRegistration.findByIdAndUpdate(
      req.params.registrationId,
      { status: status },
      { new: true }
    );

    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    res.json({ message: 'Registration status updated', registration });
  } catch (error) {
    console.error('Error updating registration status:', error);
    res.status(500).json({ error: 'Failed to update registration status' });
  }
});

module.exports = router;
