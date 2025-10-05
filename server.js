// server.js

// Load environment variables (only in local dev; Vercel provides env at runtime)
if (!process.env.VERCEL) {
  require('dotenv').config(); // loads .env
  require('dotenv').config({ path: './sendgrid.env' }); // loads SendGrid API key
}

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express(); // Must initialize app first

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- Serve static files ---
app.use(express.static(path.join(__dirname)));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Routes ---
const authRoutes = require('./auth'); // Your auth.js
const memberAuthRoutes = require('./memberAuth'); // Member authentication routes
const eventRoutes = require('./eventRoutes'); // Event management routes
const messageRoutes = require('./messageRoutes'); // Message routes
const paymentRoutes = require('./paymentRoutes'); // Payment routes
app.use('/api/auth', authRoutes);
app.use('/api/member', memberAuthRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/payment', paymentRoutes);

// --- Committees API ---
app.get('/api/committees', (req, res) => {
  const committees = [
    {
      id: '1',
      name: 'Tech Committee',
      description: 'Responsible for organizing tech events, workshops, and hackathons. We focus on promoting technology and innovation within the community.',
      memberCount: 15,
      category: 'Technology'
    },
    {
      id: '2',
      name: 'Cultural Committee',
      description: 'Organizes cultural events, festivals, and performances. We celebrate diversity and promote cultural awareness.',
      memberCount: 22,
      category: 'Culture'
    },
    {
      id: '3',
      name: 'Sports Committee',
      description: 'Manages sports events, tournaments, and fitness activities. We promote healthy living and team spirit.',
      memberCount: 18,
      category: 'Sports'
    },
    {
      id: '4',
      name: 'Social Welfare Committee',
      description: 'Organizes community service activities, charity events, and social awareness campaigns.',
      memberCount: 12,
      category: 'Social'
    }
  ];
  
  res.json(committees);
});

// --- Profile API ---
app.get('/api/profile', (req, res) => {
  const profile = {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Committee Member',
    avatar: 'https://i.pravatar.cc/150?img=1',
    phone: '+1 234 567 8900',
    bio: 'Active member of the tech committee, passionate about web development and event organization.',
    eventsAttended: 12,
    committeesJoined: 2,
    achievements: 5
  };
  
  res.json(profile);
});

// --- Badges API ---
app.get('/api/badges', (req, res) => {
  const badges = [
    {
      id: '1',
      name: 'First Event',
      description: 'Attended your first event',
      icon: 'event',
      requirement: 'Attend any event to earn this badge',
      category: 'Participation'
    },
    {
      id: '2',
      name: 'Committee Member',
      description: 'Joined your first committee',
      icon: 'groups',
      requirement: 'Join any committee to earn this badge',
      category: 'Community'
    },
    {
      id: '3',
      name: 'Active Participant',
      description: 'Participated in 5 events',
      icon: 'star',
      requirement: 'Attend 5 events to earn this badge',
      category: 'Participation'
    },
    {
      id: '4',
      name: 'Team Player',
      description: 'Joined 3 committees',
      icon: 'people',
      requirement: 'Join 3 committees to earn this badge',
      category: 'Community'
    },
    {
      id: '5',
      name: 'Social Butterfly',
      description: 'Sent 10 messages',
      icon: 'chat',
      requirement: 'Send 10 messages to earn this badge',
      category: 'Communication'
    },
    {
      id: '6',
      name: 'Profile Complete',
      description: 'Completed your profile',
      icon: 'person',
      requirement: 'Complete all profile fields to earn this badge',
      category: 'Profile'
    },
    {
      id: '7',
      name: 'Event Organizer',
      description: 'Helped organize an event',
      icon: 'event_available',
      requirement: 'Be assigned as event organizer by admin',
      category: 'Leadership'
    },
    {
      id: '8',
      name: 'Volunteer',
      description: 'Volunteered for community service',
      icon: 'volunteer_activism',
      requirement: 'Participate in volunteer activities',
      category: 'Service'
    }
  ];
  
  res.json(badges);
});

// --- Admin Badge Management API ---
app.post('/api/admin/award-badge', (req, res) => {
  const { userId, badgeId, reason } = req.body;
  
  // Here you would save the badge award to the database
  // For now, just return success
  res.json({ 
    success: true, 
    message: 'Badge awarded successfully',
    badgeId: badgeId,
    userId: userId,
    reason: reason
  });
});

app.get('/api/admin/user-badges/:userId', (req, res) => {
  const { userId } = req.params;
  
  // Here you would fetch user's badges from database
  // For now, return mock data
  res.json({
    userId: userId,
    badges: ['1', '2'], // Array of badge IDs the user has earned
    totalBadges: 2
  });
});

// --- Real-time Coordination APIs ---
app.get('/api/admin/dashboard-stats', (req, res) => {
  const stats = {
    totalEvents: 12,
    newMembers: 8,
    totalImpressions: 15420,
    badgesAwarded: 25,
    messagesSent: 156,
    activeCommittees: 4,
    recentActivity: [
      {
        id: '1',
        type: 'event_created',
        message: 'New event "Tech Workshop" created',
        timestamp: new Date().toISOString(),
        icon: 'event'
      },
      {
        id: '2',
        type: 'member_joined',
        message: 'New member John Doe joined',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        icon: 'person_add'
      },
      {
        id: '3',
        type: 'badge_awarded',
        message: 'Badge "First Event" awarded to Jane Smith',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        icon: 'emoji_events'
      }
    ]
  };
  
  res.json(stats);
});

// --- Message Coordination API ---
app.get('/api/messages/admin-stats', (req, res) => {
  const stats = {
    totalMessages: 156,
    avgResponseTime: 12,
    activeConversations: 8,
    unreadMessages: 3
  };
  
  res.json(stats);
});

// --- Event Coordination API ---
app.get('/api/events/admin-stats', (req, res) => {
  const stats = {
    totalEvents: 12,
    upcomingEvents: 5,
    totalRegistrations: 89,
    popularEvents: [
      { id: '1', title: 'Tech Workshop', registrations: 45 },
      { id: '2', title: 'Cultural Night', registrations: 32 },
      { id: '3', title: 'Sports Tournament', registrations: 28 }
    ]
  };
  
  res.json(stats);
});

// --- Admin page ---
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// --- Fallback for other routes ---
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// --- Database Connection ---
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ Error: MONGO_URI is not defined in your environment variables.");
  // Don't exit in production, just log the error
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
}

// Connect to MongoDB
if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => {
      console.log('✅ MongoDB connected successfully!');
    })
    .catch(err => {
      console.error('❌ MongoDB connection error:', err.message);
      console.log('⚠️  Running in offline mode - data will not persist');
      console.log('💡 To fix: Install MongoDB or use MongoDB Atlas');
    });
} else {
  console.log('⚠️  No MongoDB URI provided - running in offline mode');
}

// Export for Vercel
module.exports = app;

// --- Optional: Debug SendGrid API Key ---
console.log('SENDGRID_API_KEY loaded:', process.env.SENDGRID_API_KEY?.startsWith('SG.') ? '✅ OK' : '❌ Invalid key');
