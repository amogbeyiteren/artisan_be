const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Create Review
router.post('/', reviewController.createReview);

// Edit Review
router.put('/:review_id', reviewController.editReview);

// Delete Review
router.delete('/:review_id', reviewController.deleteReview);

module.exports = router;
