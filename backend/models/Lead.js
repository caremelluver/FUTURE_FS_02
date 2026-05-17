const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: String, default: 'Admin' },
});

const LeadSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Customer name is required'], trim: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: { type: String, trim: true, default: '' },
    source: {
      type: String,
      enum: ['Website Contact Form', 'Instagram', 'Facebook', 'Walk-in', 'Catering Inquiry', 'Event Booking'],
      default: 'Website Contact Form',
    },
    inquiryType: {
      type: String,
      enum: ['Table Booking', 'Catering', 'Event', 'General Inquiry', 'Feedback', 'Other'],
      default: 'General Inquiry',
    },
    message: { type: String, default: '' },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Interested', 'Converted', 'Closed'],
      default: 'New',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    notes: [NoteSchema],
    followUpDate: { type: Date, default: null },
    followUpCompleted: { type: Boolean, default: false },
    assignedTo: { type: String, default: 'Admin' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lead', LeadSchema);
