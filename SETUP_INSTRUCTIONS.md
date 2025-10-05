# POP N' PLAN - Setup Instructions

## Prerequisites

1. **Install Node.js**
   - Download from: https://nodejs.org/
   - Choose the LTS version
   - After installation, restart your terminal/command prompt

2. **Install MongoDB (Optional for testing)**
   - Download from: https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/atlas

## Quick Start

### Option 1: Using the Batch File (Windows)
1. Double-click `start-server.bat`
2. The script will automatically install dependencies and start the server

### Option 2: Using PowerShell Script
1. Right-click on `start-server.ps1`
2. Select "Run with PowerShell"
3. The script will install dependencies and start the server

### Option 3: Using Command Line (if Node.js is in PATH)
1. Open Command Prompt or PowerShell
2. Navigate to the project folder
3. Run: `npm install` then `node server.js`

### Option 4: Using Full Path (if Node.js is not in PATH)
1. Open Command Prompt or PowerShell
2. Navigate to the project folder
3. Run: `"C:\Program Files\nodejs\npm.cmd" install`
4. Run: `"C:\Program Files\nodejs\node.exe" server.js`

## Access the Application

1. **Admin Panel**: http://localhost:5000/admin
2. **Events Page**: http://localhost:5000/event.html
3. **Member Dashboard**: http://localhost:5000/dash.html
4. **Registration Form**: http://localhost:5000/regi.html

## Features

### Admin Panel Features:
- ✅ Create events with AM/PM time selection
- ✅ View all events
- ✅ Edit/Delete events
- ✅ View event registrations
- ✅ Approve/Reject registrations
- ✅ Export data to Excel

### Member Features:
- ✅ View upcoming events
- ✅ Register for events
- ✅ Search events

## Troubleshooting

### "node is not recognized" Error
- Install Node.js from https://nodejs.org/
- Restart your terminal after installation
- If still not working, use the full path: `"C:\Program Files\nodejs\node.exe"`

### "Cannot find module 'merge-descriptors'" Error
- This means dependencies are missing or corrupted
- Run: `"C:\Program Files\nodejs\npm.cmd" install`
- Or use the batch file: `start-server.bat`

### "npm is not recognized" Error
- Use the full path: `"C:\Program Files\nodejs\npm.cmd"`
- Or add Node.js to your PATH environment variable

### "Server Not Running" Error
- Make sure the server is started with `node server.js`
- Check if port 5000 is available
- Use the batch file for automatic setup

### Database Connection Issues
- ✅ **FIXED**: The app now works without MongoDB using mock data
- For full functionality, install MongoDB or use MongoDB Atlas
- Mock data includes sample events and registrations for testing

### MongoDB Setup (Optional)
If you want to use a real database:

**Option 1: Install MongoDB Locally**
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Install and start MongoDB service
3. The app will automatically connect when MongoDB is available

**Option 2: Use MongoDB Atlas (Cloud)**
1. Go to: https://www.mongodb.com/atlas
2. Create a free account and cluster
3. Get your connection string
4. Update the MONGO_URI in .env file

## Testing the Complete Flow

1. **Start the server**: `node server.js`
2. **Open Admin Panel**: http://localhost:5000/admin
3. **Create an event** with AM/PM time
4. **Open Events page**: http://localhost:5000/event.html
5. **Click Register** on the event
6. **Fill registration form** and submit
7. **Go back to Admin Panel** → Reports to see the registration

## API Endpoints

- `GET /api/events` - Get all events
- `POST /api/events` - Create event (Admin)
- `POST /api/events/:id/register` - Register for event
- `GET /api/events/admin/all-registrations` - Get all registrations (Admin)

## Support

If you encounter any issues:
1. Check if Node.js is installed: `node --version`
2. Check if the server is running: Look for "Server running on http://localhost:5000"
3. Check the browser console for any JavaScript errors
