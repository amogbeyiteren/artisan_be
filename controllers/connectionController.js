const Connection = require('../models/connection');
const User = require('../models/user');

// Create Connection
exports.createConnection = async (req, res) => {
  try {
    const { client_id, artisan_id } = req.body;

    // Check if the connection already exists
    const existingConnection = await Connection.findOne({ client_id, artisan_id });
    if (existingConnection) {
      return res.status(409).send('Connection already exists');
    }

    // Create a new connection
    const connection = new Connection({ client_id, artisan_id });
    await connection.save();
    res.status(201).send('Connection created');
  } catch (error) {
    res.status(400).send(error.message);
  }
};



// Delete Connection
exports.deleteConnection = async (req, res) => {
  try {
    await Connection.findByIdAndDelete(req.params.connection_id);
    res.send('Connection deleted');
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// View Connections with Appended User Details
exports.viewConnections = async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming userId is passed in params or req.body based on your route setup

    // Fetch user details based on user ID
    const user = await User.findById(userId);

    // Determine if the user is a client or artisan based on user_type
    const userType = user.user_type;

    // Query connections based on client_id or artisan_id
    let connections;
    if (userType === 'client') {
      connections = await Connection.find({ client_id: userId }).populate('artisan_id');
      // Modify connections to replace client_id with null
     sanitizedConnections = connections.map(connection => ({
      ...connection.toJSON(),
      client_id: null
    }));

    } else if (userType === 'artisan') {
      connections = await Connection.find({ artisan_id: userId }).populate('client_id');
      // Modify connections to replace client_id with null
     sanitizedConnections = connections.map(connection => ({
      ...connection.toJSON(),
      artisan_id: null
    }));

    } else {
      throw new Error('Invalid user type');
    }


    res.json(sanitizedConnections);
  } catch (error) {
    res.status(400).send(error.message);
  }
};
