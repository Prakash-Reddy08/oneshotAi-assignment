const router = require('express').Router();
const bookingController = require('../controllers/appointmentController');
const verifyJWT = require('../middleware/verifyJWT');

router.get('/booked-slots', verifyJWT, bookingController.getBookedSlots);

router.post('/book-slot', verifyJWT, bookingController.bookSlot);

router.get('/user-bookings/:userId', verifyJWT, bookingController.getUserBookings);

router.delete('/cancel-booking/:bookingId', verifyJWT, bookingController.cancelBooking);

module.exports = router;
