const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const WebSocket = require('./websocket')
const bodyParser = require('body-parser');
require('dotenv').config();


const app = express();
const server = http.createServer(app);


const port = process.env.PORT || 3000;



// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});
WebSocket(server)


// Routes
const userRoutes = require('./routes/users');
const connectionRoutes = require('./routes/connections');
const appointmentRoutes = require('./routes/appointments');
const reviewRoutes = require('./routes/reviews');
const portfolioRoutes = require('./routes/portfolios');
const messageRoutes = require('./routes/messages'); // New message route
const accountRoutes = require('./routes/account')

// Use Routes
app.use('/users', userRoutes);
app.use('/connections', connectionRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/reviews', reviewRoutes);
app.use('/portfolios', portfolioRoutes);
app.use('/accounts', accountRoutes);
app.use('/messages', messageRoutes); // Use the messages route

// Start server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
