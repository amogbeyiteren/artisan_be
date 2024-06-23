const express = require('express');
const userController = require('../controllers/userController');
const Multer = require('multer');

// Multer configuration
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
  }
});

const router = express.Router();

router.post('/register', multer.single('picture'), userController.createUser);
router.post('/login', userController.loginUser);
router.post('/logout', userController.logoutUser);
router.get('/all', userController.listUsers);
router.get('/search', userController.searchUsers);
router.put('/:id', multer.single('picture'), userController.editUserProfile);
router.get('/:id', userController.viewUser); 

module.exports = router;
