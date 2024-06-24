const express = require('express');
const { Storage } = require('@google-cloud/storage');
const Multer = require('multer');
const format = require('util').format;
const User = require('../models/user');
const Account = require('../models/account'); // Import Account model
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Configuration for Google Cloud Storage
const storage = new Storage({
  projectId: process.env.FIREBASE_PROJECT_ID,
  keyFilename: require("../firebase_service_account.json")
});
const firebase_bucket_url = process.env.FIREBASE_BUCKET_URL;

const bucket = storage.bucket(firebase_bucket_url);

// Multer configuration
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
  }
});

/**
 * Upload the image file to Google Storage
 * @param {File} file object that will be uploaded to Google Storage
 */
const uploadImageToStorage = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject('No image file');
    }
    let newFileName = `${file.originalname}_${Date.now()}`;

    let fileUpload = bucket.file(newFileName);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype
      }
    });

    blobStream.on('error', (error) => {
      reject('Something is wrong! Unable to upload at the moment.');
    });

    blobStream.on('finish', () => {
      // The public URL can be used to directly access the file via HTTP.
      const url = format(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
      resolve(url);
    });

    blobStream.end(file.buffer);
  });
};

// Create User
exports.createUser = async (req, res) => {
  try {
    const { email, fname, lname, password, user_type, mobile_number, address, city, state, service } = req.body;

    // Upload profile picture if provided
    let pictureUrl = '';
    if (req.file) {
      pictureUrl = await uploadImageToStorage(req.file);
    }

    const user = new User({
      email,
      fname,
      lname,
      password,
      user_type,
      mobile_number,
      address,
      city,
      state,
      picture: pictureUrl,
      service

    });

    await user.save();

    // Create an account for the user with 0 balance
    const account = new Account({
      user_id: user._id,
      balance: 0
    });

    await account.save();

    // Link the account to the user
    user.account = account._id;
    await user.save();

    res.status(201).send('User created with an account');
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// User Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await user.matchPassword(password)) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).send('Invalid email or password');
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// User Logout
exports.logoutUser = (req, res) => {
  // Implement logout functionality based on your authentication strategy
  res.send('User logged out');
};

// List All Users
exports.listUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Search Users
exports.searchUsers = async (req, res) => {
  try {
    let query = {};
    if (req.query.query) {
      query = { ...query, $text: { $search: req.query.query } };
    }
    if (req.query.user_type) {
      query = { ...query, user_type: req.query.user_type };
    }
    if (req.query.service) {
      query = { ...query, service: req.query.service };
    }

    const users = await User.find(query);
    res.json(users);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Edit User Profile
exports.editUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const { email, fname, lname, password, user_type, mobile_number, address, city, state } = req.body;


    // Upload new profile picture if provided
    let pictureUrl = '';
    if (req.file) {
      pictureUrl = await uploadImageToStorage(req.file);
    }

    const updatedData = {
      email,
      fname,
      lname,
      password,
      user_type,
      mobile_number,
      address,
      city,
      state
    };

    // Include picture URL if a new picture is uploaded
    if (pictureUrl) {
      updatedData.picture = pictureUrl;
    }

    // Only update password if it is provided
    if (!password) {
      delete updatedData.password;
    }

    const user = await User.findByIdAndUpdate(userId, updatedData, { new: true });

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// View Specific User
exports.viewUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

