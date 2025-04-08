// scripts/create-admin.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/models/User.js';
import 'dotenv/config';

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const hashedPassword = await bcrypt.hash('admin123', 10);

  await User.create({
    email: 'admin@primetv.com',
    password: hashedPassword,
  });

  console.log('✅ Admin creado');
  mongoose.disconnect();
}

main();
