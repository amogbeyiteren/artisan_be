const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// Create appointment
router.post('/', appointmentController.createAppointment);

// Edit appointment
router.put('/:appointment_id', appointmentController.editAppointment);

// Delete appointment
router.delete('/:appointment_id', appointmentController.deleteAppointment);

// List all appointments for a client
router.get('/client/:client_id', appointmentController.listAppointmentsForClient);

// List all appointments for an artisan
router.get('/artisan/:artisan_id', appointmentController.listAppointmentsForArtisan);

router.patch('/appointments/:appointment_id', appointmentController.completeAppointment);


module.exports = router;
