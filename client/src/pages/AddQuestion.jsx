import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import './AddQuestion.css';

export default function AddQuestion({ me }) {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('General');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const categories = [
    'General Knowledge',
    'Science',
    'Technology',
    'History',
    'Geography',
    'Sports',
    'Mathematics',
    'General'
  ];

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
      if (answer === options[index]) {
        setAnswer('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!question.trim()) {
      setError('Question is required');
      return;
    }

    const validOptions = options.filter(opt => opt.trim() !== '');
    if (validOptions.length < 2) {
      setError('At least 2 options are required');
      return;
    }

    if (validOptions.length > 6) {
      setError('Maximum 6 options allowed');
      return;
    }

    if (!answer.trim()) {
      setError('Please select the correct answer');
      return;
    }

    if (!validOptions.includes(answer)) {
      setError('Correct answer must be one of the options');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/quiz/add-question', {
        question: question.trim(),
        options: validOptions,
        answer: answer.trim(),
        category: category
      });

      setSuccess('Question added successfully!');
      
      // Reset form
      setQuestion('');
      setOptions(['', '', '', '']);
      setAnswer('');
      setCategory('General');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      console.error('Failed to add question:', error);
      const errorMsg = error.response?.data?.msg || error.message || 'Failed to add question';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-question-page">
      <Navbar me={me} />
      
      <div className="add-question-container">
        <div className="card add-question-card">
          <h2 className="add-question-title">Add New Quiz Question</h2>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="add-question-form">
            <div className="form-group">
              <label htmlFor="question" className="form-label">
                Question *
              </label>
              <textarea
                id="question"
                className="input-field input-textarea"
                placeholder="Enter your question here..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
                rows="3"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Options * (At least 2, maximum 6)</label>
              {options.map((option, index) => (
                <div key={index} className="option-row">
                  <input
                    type="text"
                    className="input-field option-input"
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(index)}
                      className="btn-remove-option"
                      title="Remove option"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              {options.length < 6 && (
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="btn-add-option"
                >
                  + Add Option
                </button>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="answer" className="form-label">
                Correct Answer *
              </label>
              <select
                id="answer"
                className="input-field"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                required
              >
                <option value="">Select correct answer</option>
                {options
                  .filter(opt => opt.trim() !== '')
                  .map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="category" className="form-label">
                Category
              </label>
              <select
                id="category"
                className="input-field"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-success form-submit-btn"
              >
                {loading ? 'Adding Question...' : 'Add Question'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn btn-danger form-cancel-btn"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

