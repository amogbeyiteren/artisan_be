const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

// Withdraw Money
router.post('/withdraw', accountController.withdrawMoney);

router.get('/:user_id',accountController.viewBalance)

// Add Money
router.post('/add', accountController.addMoney);

// Transfer Money
router.post('/transfer', accountController.transferMoney);

module.exports = router;
