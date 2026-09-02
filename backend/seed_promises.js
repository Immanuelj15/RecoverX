require('dotenv').config();
const mongoose = require('mongoose');
const PromiseToPay = require('./src/models/PromiseToPay');

const URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/recoverx';

async function seedPromises() {
  try {
    await mongoose.connect(URI);
    
    // Clear existing
    await PromiseToPay.deleteMany({});
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const seedData = [
      {
        leakageEventId: 'EVT-1001',
        customerName: 'Acme Corp',
        customerEmail: 'finance@acmecorp.com',
        promisedAmount: 15000,
        promisedDate: tomorrow,
        status: 'PENDING',
        channel: 'PHONE',
        notes: 'CFO promised to wire funds by tomorrow morning.',
        owner: 'Priya N.'
      },
      {
        leakageEventId: 'EVT-1002',
        customerName: 'Global Tech',
        customerEmail: 'billing@globaltech.com',
        promisedAmount: 45000,
        promisedDate: yesterday,
        status: 'MISSED',
        channel: 'EMAIL',
        notes: 'Promised to clear invoice but payment not received yet.',
        owner: 'Rahul K.'
      },
      {
        leakageEventId: 'EVT-1003',
        customerName: 'Beta Solutions',
        customerEmail: 'admin@betasolutions.in',
        promisedAmount: 8500,
        promisedDate: today,
        status: 'PENDING',
        channel: 'WHATSAPP',
        notes: 'Customer asked for time till EOD today.',
        owner: 'Priya N.'
      },
      {
        leakageEventId: 'EVT-1004',
        customerName: 'John Doe',
        customerEmail: 'john.doe@gmail.com',
        promisedAmount: 1200,
        promisedDate: yesterday,
        status: 'FULFILLED',
        channel: 'EMAIL',
        notes: 'Paid via link sent yesterday.',
        owner: 'System'
      }
    ];

    await PromiseToPay.insertMany(seedData);
    console.log('Promises seeded successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding:', error);
    process.exit(1);
  }
}

seedPromises();
