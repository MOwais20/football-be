const express = require("express");
const path = require('path');
const multer = require('multer');
const app = express();
var cors = require('cors')

app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allow specific headers if needed
}));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  console.log("Hello");
  
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const storage = multer.memoryStorage();
// Configure multer to save uploaded files in the 'public/uploads' directory
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/uploads');
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   }
// });

// Filter files to only accept images and limit file size to 100 KB
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 100 * 1024 // 100 KB
  }
});



// Routes
require("./router")(express, app);
require("./config/sqlite")(app, upload, storage);

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


