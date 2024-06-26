// controllers/userController.js

const User = require('../models/user');

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update User Profile
const updateUserProfile = async (req, res) => {
  const { name, email, about, skills, isVerified } = req.body;

  try {
    let user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if the new email is already taken by another user
    if (email && email !== user.email) {
      let emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ msg: 'Email already in use' });
      }
    }

    // Update user fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.about = about || user.about;
    user.skills = skills || user.skills; // Ensure skills are updated properly
    user.isVerified = isVerified !== undefined ? isVerified : user.isVerified;

    await user.save();

    // Exclude password from the response
    const updatedUser = await User.findById(req.user.userId).select('-password');

    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile
};
