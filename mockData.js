// Mock data storage for when MongoDB is not available
let mockEvents = [
  {
    _id: 'mock1',
    title: 'Tech Workshop',
    description: 'Learn the latest in web development',
    date: '2024-01-15',
    time: '10:00 AM',
    venue: 'Computer Lab',
    image: 'https://via.placeholder.com/400x200?text=Tech+Workshop',
    createdBy: 'admin',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'mock2',
    title: 'Cultural Festival',
    description: 'Annual cultural celebration with performances',
    date: '2024-01-20',
    time: '6:00 PM',
    venue: 'Main Auditorium',
    image: 'https://via.placeholder.com/400x200?text=Cultural+Festival',
    createdBy: 'admin',
    createdAt: new Date().toISOString()
  }
];

let mockRegistrations = [
  {
    _id: 'reg1',
    eventId: 'mock1',
    eventTitle: 'Tech Workshop',
    registrantName: 'John Doe',
    registrantEmail: 'john@example.com',
    registrantPhone: '1234567890',
    registrantClass: 'CS-3',
    registrantRollNo: 'CS2023001',
    registrantPRN: 'PRN123456',
    registrationDate: new Date().toISOString(),
    status: 'pending'
  }
];

// Mock data functions
const mockData = {
  // Events
  getEvents: () => mockEvents,
  addEvent: (event) => {
    const newEvent = {
      _id: 'mock' + Date.now(),
      ...event,
      createdAt: new Date().toISOString()
    };
    mockEvents.push(newEvent);
    return newEvent;
  },
  updateEvent: (id, updates) => {
    const index = mockEvents.findIndex(e => e._id === id);
    if (index !== -1) {
      mockEvents[index] = { ...mockEvents[index], ...updates };
      return mockEvents[index];
    }
    return null;
  },
  deleteEvent: (id) => {
    const index = mockEvents.findIndex(e => e._id === id);
    if (index !== -1) {
      mockEvents.splice(index, 1);
      return true;
    }
    return false;
  },

  // Registrations
  getRegistrations: () => mockRegistrations,
  addRegistration: (registration) => {
    const newRegistration = {
      _id: 'reg' + Date.now(),
      ...registration,
      registrationDate: new Date().toISOString(),
      status: 'pending'
    };
    mockRegistrations.push(newRegistration);
    return newRegistration;
  },
  updateRegistrationStatus: (id, status) => {
    const index = mockRegistrations.findIndex(r => r._id === id);
    if (index !== -1) {
      mockRegistrations[index].status = status;
      return mockRegistrations[index];
    }
    return null;
  }
};

module.exports = mockData;
