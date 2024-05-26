const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB with default settings
const uri = 'mongodb://localhost:27017/mydatabase'; // Use the database name you created

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

// Use the correct syntax to define the model
const User = mongoose.model('User', userSchema);

// Serve the login page and user creation form
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

// Handle password update POST request
app.post('/update-password', async (req, res) => {
  const username = req.body.username;
  const newPassword = req.body.newPassword;

  try {
    const result = await User.updateOne(
      { username: username },
      { $set: { password: newPassword } }
    );
    if (result.nModified > 0) {
      res.send('Password updated successfully!');
    } else {
      res.send('User not found or password unchanged!');
    }
  } catch (err) {
    res.send('Error occurred!');
  }
});

// Handle user creation POST request
app.post('/create-user', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      res.send('User already exists!');
    } else {
      const newUser = new User({
        username: username,
        password: password
      });
      await newUser.save();
      res.send('User created successfully!');
    }
  } catch (err) {
    res.send('Error occurred!');
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
