const { readUsers, writeUsers } = require('../utils/fileUtils');
const USERS_FILE = 'users.json';

exports.registerUser = (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const users = readUsers(USERS_FILE);
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ message: 'User already exists.' });
  }

  users.push({ name, email, password });
  writeUsers(USERS_FILE, users);
  res.status(201).json({ name, email });
};

exports.loginUser = (req, res) => {
  const { email, password } = req.body;
  const users = readUsers(USERS_FILE);
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    res.json({ name: user.name, email: user.email });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};