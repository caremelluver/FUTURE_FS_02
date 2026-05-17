const express = require('express');
const router = express.Router();
const {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  addNote,
  deleteNote,
} = require('../controllers/leadController');
const { protect } = require('../middleware/auth');

// Public route for contact form submissions
router.post('/public', createLead);

// Protected routes
router.get('/', protect, getLeads);
router.get('/:id', protect, getLead);
router.post('/', protect, createLead);
router.put('/:id', protect, updateLead);
router.delete('/:id', protect, deleteLead);

// Notes
router.post('/:id/notes', protect, addNote);
router.delete('/:id/notes/:noteId', protect, deleteNote);

module.exports = router;
