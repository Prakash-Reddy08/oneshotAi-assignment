const router = require('express').Router();
const bookingController = require('../controllers/appointmentController');

router.get('/booked-slots', bookingController.getBookedSlots);

router.post('/book-slot', bookingController.bookSlot);

router.get('/user-bookings/:userId', bookingController.getUserBookings);

router.delete('/cancel-booking/:bookingId', bookingController.cancelBooking);

module.exports = router;
