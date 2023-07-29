const Appointment = require("../database/models/Appointment");


exports.getBookedSlots = async (req, res) => {
    try {
        const bookedSlots = {};
        const bookings = await Appointment.find({});
        bookings.forEach((booking) => {
            const date = booking.date.toISOString().slice(0, 10);
            if (!bookedSlots[date]) {
                bookedSlots[date] = [];
            }
            bookedSlots[date].push(booking.timeSlot);
        });

        res.json(bookedSlots);
    } catch (err) {
        console.error('Error fetching booked slots:', err);
        res.status(500).json({ error: 'Server error' });
    }
};


exports.bookSlot = async (req, res) => {
    try {
        const { date, timeSlot, userId } = req.body;
        if (!date || !timeSlot || !userId) {
            return res.status(400).json({ error: "Something Went Wrong" })
        }
        const existingBooking = await Appointment.findOne({ date, timeSlot });
        if (existingBooking) {
            return res.status(400).json({ error: 'Slot is already booked' });
        }

        const booking = new Appointment({ date, timeSlot, bookedBy: userId });
        await booking.save();

        res.json({ message: 'Booking successful' });
    } catch (err) {
        console.error('Error booking slot:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getUserBookings = async (req, res) => {
    try {
        const { userId } = req.params;

        const bookings = await Appointment.find({ bookedBy: userId });

        res.json(bookings);
    } catch (err) {
        console.error('Error fetching user bookings:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;

        const booking = await Appointment.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        await Appointment.deleteOne({ _id: bookingId });

        res.json({ message: 'Booking cancelled successfully' });
    } catch (err) {
        console.error('Error cancelling booking:', err);
        res.status(500).json({ error: 'Server error' });
    }
};