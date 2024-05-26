const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB with default settings
const uri = 'mongodb://localhost:27017/your_database'; // Replace 'your_database' with your actual database name

mongoose.connect(uri).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Failed to connect to MongoDB', err);
});

// Define the User schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});
const User = mongoose.model('User', userSchema);

// Serve the login page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle login POST request
app.post('/login', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    const foundUser = await User.findOne({ username: username, password: password });
    if (foundUser) {
      res.send('Login successful!');
    } else {
      res.send('Invalid username or password!');
    }
  } catch (err) {
    res.send('Error occurred!');
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
