const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

// Register function
exports.register = async (req, res) => {
  const { name, email, password, skills, about, username } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user = new User({
      name,
      email,
      password: hashedPassword,
      otp,
      skills,
      about,
      username,
      isVerified: false,
    });
    await user.save();

    await sendEmail(email, 'Verify your email', `Your OTP is ${otp}`);

    res.status(201).json({ msg: 'User registered. Please check your email for the OTP.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Login function
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    if (!user.isVerified) {
      return res.status(400).json({ msg: 'Email is not verified. Please verify your email.' });
    }

    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Verify OTP function
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    console.log('Received OTP:', otp);
    console.log('Stored OTP:', user ? user.otp : 'User not found');

    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ msg: 'Invalid OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    await user.save();

    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Logout function
exports.logout = (req, res) => {
  res.status(200).json({ msg: 'Logged out successfully' });
};
