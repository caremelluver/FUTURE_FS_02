const mongoose = require('mongoose');
const User = require('./models/User');
const Lead = require('./models/Lead');
const dotenv = require('dotenv');
dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await User.deleteMany();
  await Lead.deleteMany();

  // Create admin user
  const admin = await User.create({
    username: 'admin',
    email: 'admin@starcafe.com',
    password: 'admin123',
    role: 'admin',
  });
  console.log('✅ Admin user created:', admin.email);

  // Seed leads
  const leads = [
    { name: 'Priya Sharma', email: 'priya@example.com', phone: '9876543210', source: 'Instagram', inquiryType: 'Table Booking', message: 'Would like to book a table for 4 for Sunday brunch.', status: 'New', priority: 'High', followUpDate: new Date(Date.now() + 86400000) },
    { name: 'Rahul Verma', email: 'rahul@example.com', phone: '9765432109', source: 'Website Contact Form', inquiryType: 'Catering', message: 'Need catering for office party of 50 people.', status: 'Contacted', priority: 'High' },
    { name: 'Ananya Singh', email: 'ananya@example.com', phone: '9654321098', source: 'Facebook', inquiryType: 'Event', message: 'Birthday event for 30 guests. Need decoration and special menu.', status: 'Interested', priority: 'Medium' },
    { name: 'Karan Mehta', email: 'karan@example.com', phone: '9543210987', source: 'Walk-in', inquiryType: 'General Inquiry', message: 'Interested in monthly subscription coffee plans.', status: 'Converted', priority: 'Low' },
    { name: 'Neha Gupta', email: 'neha@example.com', phone: '9432109876', source: 'Catering Inquiry', inquiryType: 'Catering', message: 'Corporate lunch for 100 people every week.', status: 'New', priority: 'High' },
    { name: 'Amit Patel', email: 'amit@example.com', phone: '9321098765', source: 'Event Booking', inquiryType: 'Event', message: 'Product launch event at your café space.', status: 'Contacted', priority: 'Medium' },
    { name: 'Sonia Kapoor', email: 'sonia@example.com', phone: '9210987654', source: 'Instagram', inquiryType: 'Table Booking', message: 'Anniversary dinner for 2 with special candle-light setup.', status: 'Interested', priority: 'Medium' },
    { name: 'Dev Malhotra', email: 'dev@example.com', phone: '9109876543', source: 'Website Contact Form', inquiryType: 'Feedback', message: 'Last visit was amazing! Would love to explore more of your menu.', status: 'Closed', priority: 'Low' },
  ];

  await Lead.insertMany(leads);
  console.log('✅ Sample leads seeded');

  mongoose.disconnect();
  console.log('✅ Seeding complete!');
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
