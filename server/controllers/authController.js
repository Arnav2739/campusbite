// [Aditya] authController.js - Register, login, profile logic

const registerUser = async (req, res) => {
  res.json({ message: 'Register endpoint placeholder' });
};

const loginUser = async (req, res) => {
  res.json({ message: 'Login endpoint placeholder' });
};

const getMe = async (req, res) => {
  res.json({ message: 'User profile placeholder' });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
