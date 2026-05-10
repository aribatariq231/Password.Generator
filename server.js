const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let savedPasswords = [];
let nextId = 1;

function generatePassword(length = 12, options = {}) {
  const {
    includeUppercase = true,
    includeLowercase = true,
    includeNumbers = true,
    includeSymbols = true
  } = options;

  let characters = '';
  
  if (includeLowercase) characters += 'abcdefghijklmnopqrstuvwxyz';
  if (includeUppercase) characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (includeNumbers) characters += '0123456789';
  if (includeSymbols) characters += '!@#$%^&*()_+';

  if (characters.length === 0) {
    return 'Please select at least one option';
  }

  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }

  return password;
}

// Generate password
app.post('/api/generate', (req, res) => {
  const { length, options } = req.body;
  const password = generatePassword(length || 12, options || {});
  res.json({ password });
});

// Save password
app.post('/api/save', (req, res) => {
  const { password, website, username } = req.body;
  
  const newPassword = {
    id: nextId++,
    password: password,
    website: website,
    username: username || '',
    createdAt: new Date().toLocaleString()
  };
  
  savedPasswords.push(newPassword);
  res.status(201).json(newPassword);
});

// Get all passwords
app.get('/api/passwords', (req, res) => {
  res.json(savedPasswords);
});

// Delete password
app.delete('/api/passwords/:id', (req, res) => {
  const id = parseInt(req.params.id);
  savedPasswords = savedPasswords.filter(p => p.id !== id);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});