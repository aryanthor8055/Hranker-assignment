require('dotenv').config();
const mongoose = require('mongoose');
const readline = require('readline');
const User = require('../models/User');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((resolve) => rl.question(q, resolve));

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const email = await ask('Admin email: ');
  const password = await ask('Admin password: ');
  rl.close();
  if (!email || !password) {
    console.log('Need email and password');
    process.exit(1);
  }
  const exists = await User.findOne({ email });
  if (exists) {
    console.log('User with that email already exists. Change role in DB to admin if needed.');
    process.exit(0);
  }
  await User.create({ email, password, role: 'admin' });
  console.log('Admin user created:', email);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
