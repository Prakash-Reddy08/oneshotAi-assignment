const router = require('express').Router();
const bookingController = require('../controllers/appointmentController');

router.get('/booked-slots', bookingController.getBookedSlots);

router.post('/book-slot', bookingController.bookSlot);

module.exports = router;
