const Message = require('./models/message');
const socketIo = require('socket.io')

module.exports = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "*", // Allow requests from any origin
      methods: ["GET", "POST"]
    }
  });

  console.log("Websockets Running");

  io.on('connection', async (socket) => {
    try {
      console.log('User connected');

      // Retrieve connection_id from client's request
      const { connection_id } = socket.handshake.query;
      
      if (!connection_id) {
        console.error('No connection_id provided');
        socket.disconnect();
        return;
      }

      // Join the room based on connection_id
      socket.join(connection_id);

      // Query MongoDB for messages with the given connection_id
      const messages = await Message.find({ connection_id });

      // Emit the messages to the connected client in the specific room
      io.to(connection_id).emit('initial messages', messages);

      // Event listener for incoming chat messages from clients
      socket.on('chat message', async (data) => {
        try {
          const { sender_id, receiver_id, content } = data;

          // Save the message to MongoDB
          const newMessage = new Message({ sender: sender_id, receiver: receiver_id, content, connection_id });
          await newMessage.save();

          // Query MongoDB again to get the updated message list
          const updated_messages = await Message.find({ connection_id });

          // Emit the updated messages to all clients in the room
          io.to(connection_id).emit('updated messages', updated_messages);

        } catch (error) {
          console.error('Error saving message:', error);
        }
      });

      socket.on('disconnect', () => {
        console.log('User disconnected');
      });
    } catch (error) {
      console.error('Error handling connection:', error);
    }
  });
};



