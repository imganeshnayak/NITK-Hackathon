// seedUsers.js
const mongoose = require('mongoose');
const User = require('./models/user');
require('dotenv').config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  const users = [
    {
      _id: new mongoose.Types.ObjectId('68d8b281bb0d0b35caf63d72'),
      name: 'Ganesh Nayak',
      email: 'ganesh@example.com',
      role: 'farmer',
      village: 'Kalsanka',
      city: 'Udupi',
      pincode: '576101',
      state: 'Karnataka',
      password: 'testpassword'
    },
    {
      _id: new mongoose.Types.ObjectId('68d8b3d9bb0d0b35caf63d73'),
      name: 'Ravi Kumar',
      email: 'ravi@example.com',
      role: 'manufacturer',
      department: 'Processing',
      officeLocation: 'Warehouse 3',
      password: 'testpassword'
    },
    {
      _id: new mongoose.Types.ObjectId('68d8adc8bb0d0b35caf63d71'),
      name: 'GANESH',
      email: 'itisganeshnayak@gmail.com',
      role: 'admin',
      department: 'Quality',
      officeLocation: 'Main Office',
      accessLevel: 'super',
      password: 'testpassword'
    }
  ];
  // Delete all users before inserting hardcoded users
  await User.deleteMany({});
  await User.insertMany(users);
  console.log('All users deleted and hardcoded users seeded successfully');
  mongoose.disconnect();
}

seed();
