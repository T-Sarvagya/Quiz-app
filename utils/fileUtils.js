const fs = require('fs');
const path = require('path');

exports.readUsers = (file) => {
  const filePath = path.join(__dirname, '..', file);
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath));
};

exports.writeUsers = (file, data) => {
  const filePath = path.join(__dirname, '..', file);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};