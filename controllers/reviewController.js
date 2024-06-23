const Review = require('../models/review');

// Create Review
exports.createReview = async (req, res) => {
  try {
    const { user_id, reviewed_user_id, rating, comment } = req.body;
    const review = new Review({ user_id, reviewed_user_id, rating, comment });
    await review.save();
    res.status(201).send('Review created');
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Edit Review
exports.editReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    await Review.findByIdAndUpdate(req.params.review_id, { rating, comment });
    res.send('Review updated');
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Delete Review
exports.deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.review_id);
    res.send('Review deleted');
  } catch (error) {
    res.status(400).send(error.message);
  }
};
