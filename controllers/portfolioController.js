const { Storage } = require('@google-cloud/storage');
const Multer = require('multer');
const format = require('util').format;
const Portfolio = require('../models/portfolio');
require('dotenv').config();

// Configuration for Google Cloud Storage
const storage = new Storage({
  projectId: process.env.FIREBASE_PROJECT_ID,
  keyFilename: require("../firebase_service_account.json")
});
firebase_bucket_url = process.env.FIREBASE_BUCKET_URL

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

// Create Portfolio
exports.createPortfolio = async (req, res) => {
  try {
    const { user_id, title, description } = req.body;
    
    // Upload attachment if provided
    let attachmentUrl = '';
    if (req.file) {
      attachmentUrl = await uploadImageToStorage(req.file);
    }

    const portfolio = new Portfolio({ user_id, title, description, attachments: attachmentUrl });
    await portfolio.save();
    res.status(201).send('Portfolio created');
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Edit Portfolio
exports.editPortfolio = async (req, res) => {
  try {
    const { title, description } = req.body;
    
    // Upload new attachment if provided
    let attachmentUrl = '';
    if (req.file) {
      attachmentUrl = await uploadImageToStorage(req.file);
    }

    const updatedData = {
      title,
      description
    };

    // Include attachment URL if a new attachment is uploaded
    if (attachmentUrl) {
      updatedData.attachments = attachmentUrl;
    }

    await Portfolio.findByIdAndUpdate(req.params.portfolio_id, updatedData);
    res.send('Portfolio updated');
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Delete Portfolio
exports.deletePortfolio = async (req, res) => {
  try {
    await Portfolio.findByIdAndDelete(req.params.portfolio_id);
    res.send('Portfolio deleted');
  } catch (error) {
    res.status(400).send(error.message);
  }
};
