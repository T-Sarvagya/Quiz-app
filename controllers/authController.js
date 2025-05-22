/*const { readUsers, writeUsers } = require('../utils/fileUtils');
const USERS_FILE = 'users.json';*/
const bcrypt = require('bcrypt');
const User = require('../models/User');
const HttpStatus = require('../utils/httpStatus');

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(HttpStatus.BAD_REQUEST).json({ message: "All fields are required." });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(HttpStatus.CONFLICT).json({ message: "Email already registered." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds
    const newUser = await User.create({ name, email, password: hashedPassword });

    res.status(HttpStatus.CREATED).json({ name: newUser.name, email: newUser.email });
  } catch (err) {
    console.error(err);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Server error." });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Invalid credentials." });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Invalid credentials." });
  }

  res.status(HttpStatus.OK).json({ name: user.name, email: user.email });
};

/*
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
};*/
