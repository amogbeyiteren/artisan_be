const express = require('express');
const portfolioController = require('../controllers/portfolioController');
const Multer = require('multer');

// Multer configuration
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
  }
});

const router = express.Router();

router.post('/', multer.single('attachment'), portfolioController.createPortfolio);
router.put('/portfolios/:portfolio_id', multer.single('attachment'), portfolioController.editPortfolio);
router.delete('/portfolios/:portfolio_id', portfolioController.deletePortfolio);
router.get('/:user_id', portfolioController.viewPortfoliosByUser);

module.exports = router;
