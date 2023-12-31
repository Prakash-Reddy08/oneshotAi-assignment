const router = require('express').Router();
const authController = require('../controllers/authController');

router.post('/request-otp', authController.requestOTP);

router.post('/verify-otp', authController.verifyOTP);

router.post("/logout", authController.logout)
module.exports = router;
