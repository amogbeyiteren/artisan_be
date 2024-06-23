const Appointment = require('../models/appointment');

exports.createAppointment = async (req, res) => {
  try {
    const { client_id, artisan_id, start_date, end_date, amount, description } = req.body;

    const appointment = new Appointment({
      client_id,
      artisan_id,
      start_date,
      end_date,
      amount,
      description
    });

    await appointment.save();
    res.status(201).send('Appointment created');
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Edit Appointment
exports.editAppointment = async (req, res) => {
  try {
    const { appointment_id } = req.params;
    const { client_id, artisan_id, start_date, end_date, amount, description } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      appointment_id,
      { client_id, artisan_id, start_date, end_date, amount, description },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).send('Appointment not found');
    }

    res.status(200).send('Appointment updated successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
};


// Delete Appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const { appointment_id } = req.params;

    const appointment = await Appointment.findByIdAndDelete(appointment_id);

    if (!appointment) {
      return res.status(404).send('Appointment not found');
    }

    res.status(200).send('Appointment deleted successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// List all appointments for a client
// exports.listAppointmentsForClient = async (req, res) => {
//   try {
//     const { client_id } = req.params;

//     const appointments = await Appointment.find({ client_id });

//     if (!appointments || appointments.length === 0) {
//       return res.status(404).send('No appointments found for this client');
//     }

//     res.status(200).json(appointments);
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// };
// List all appointments for a client
// Helper function to format the date
const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

exports.listAppointmentsForClient = async (req, res) => {
  try {
    const { client_id } = req.params;

    // Find appointments and populate the artisan's name from the User model
    const appointments = await Appointment.find({ client_id }).populate('artisan_id', 'fname');

    if (!appointments || appointments.length === 0) {
      return res.status(404).send('No appointments found for this client');
    }

    // Transform the response to include artisan_name at the top level
    const transformedAppointments = appointments.map(appointment => ({
      _id: appointment._id,
      client_id: appointment.client_id,
      artisan_id: appointment.artisan_id._id,
      artisan_name: appointment.artisan_id.fname,
      start_date: formatDate(appointment.start_date),
      end_date: formatDate(appointment.end_date),
      amount: appointment.amount,
      description: appointment.description
      // Include other fields if needed
    }));

    res.status(200).json(transformedAppointments);
  } catch (error) {
    res.status(400).send(error.message);
  }
};


// List all appointments for an artisan
// exports.listAppointmentsForArtisan = async (req, res) => {
//   try {
//     const { artisan_id } = req.params;

//     const appointments = await Appointment.find({ artisan_id });

//     if (!appointments || appointments.length === 0) {
//       return res.status(404).send('No appointments found for this artisan');
//     }

//     res.status(200).json(appointments);
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// };

// List all appointments for an artisan
exports.listAppointmentsForArtisan = async (req, res) => {
  try {
    const { artisan_id } = req.params;

    // Find appointments and populate the client's name from the User model
    const appointments = await Appointment.find({ artisan_id }).populate('client_id', 'fname');

    if (!appointments || appointments.length === 0) {
      return res.status(404).send('No appointments found for this artisan');
    }

    // Transform the response to include client_name at the top level
    const transformedAppointments = appointments.map(appointment => ({
      _id: appointment._id,
      client_id: appointment.client_id._id,
      client_name: appointment.client_id.fname,
      artisan_id: appointment.artisan_id,
      start_date: formatDate(appointment.start_date),
      end_date: formatDate(appointment.end_date),
      amount: appointment.amount,
      description: appointment.description
      
    }));

    res.status(200).json(transformedAppointments);
  } catch (error) {
    res.status(400).send(error.message);
  }
};