const express = require('express');
const router = express.Router();
const connectionController = require('../controllers/connectionController');

// Create Connection
router.post('/', connectionController.createConnection);

// Delete Connection
router.delete('/:connection_id', connectionController.deleteConnection);
router.get('/:userId', connectionController.viewConnections);

module.exports = router;
