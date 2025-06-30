const mongoose = require('mongoose');

const questionnaireOptionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['branches', 'years', 'skills', 'work_types', 'work_settings', 'salary_ranges'], // Define types of options
    unique: true
  },
  options: {
    type: [String], // Array of strings for the options
    required: true
  }
}, { timestamps: true });

const QuestionnaireOption = mongoose.model('QuestionnaireOption', questionnaireOptionSchema);
module.exports = QuestionnaireOption;