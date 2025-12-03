# Quiz Submission and Question Adding Guide

## Features Added

### 1. ✅ Quiz Answer Submission
   - Answers are now submitted to backend for evaluation
   - Backend evaluates answers and calculates correct score
   - Score is automatically saved to user's profile
   - Results page shows accurate scores

### 2. ✅ Add Questions via UI
   - New "Add Question" page
   - Form to add quiz questions through the web interface
   - Validates questions before submission
   - Added to Dashboard as quick action

## How Quiz Submission Works

### Frontend (Quiz.jsx)
1. User selects answers for each question
2. Answers are tracked along with question IDs
3. When quiz is completed, answers + question IDs are sent to backend
4. Backend evaluates answers and returns results
5. Results are saved and displayed

### Backend (quizController.js)
1. Receives answers and question IDs
2. Fetches questions from database with correct answers
3. Compares user answers with correct answers
4. Calculates score (correct/total)
5. Saves score to user's profile
6. Returns detailed results

## How to Add Questions

### Option 1: Via Web Interface (NEW! 🎉)

1. **Login to your account**
2. **Go to Dashboard**
3. **Click "Add Question" button**
4. **Fill in the form:**
   - Question text
   - Options (2-6 options)
   - Select correct answer
   - Choose category
5. **Click "Add Question"**

### Option 2: Via Seed Script

```bash
cd server
npm run seed
```

This adds 30+ sample questions.

### Option 3: Via API (Programmatically)

```javascript
POST /api/quiz/add-question
{
  "question": "Your question?",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "answer": "Option 1",
  "category": "General Knowledge"
}
```

## API Endpoints

### Public Endpoints
- `GET /api/quiz/questions` - Get quiz questions
- `POST /api/quiz/add-question` - Add a new question

### Protected Endpoints (Require Login)
- `POST /api/quiz/submit` - Submit quiz answers for evaluation
- `POST /api/quiz/save-score` - Save score directly
- `GET /api/quiz/my-scores` - Get user's quiz scores

## Quiz Flow

1. **User starts quiz** → Questions loaded from database
2. **User answers questions** → Answers tracked per question
3. **User submits quiz** → Answers sent to backend with question IDs
4. **Backend evaluates** → Compares answers with correct answers
5. **Score calculated** → Correct/total with percentage
6. **Score saved** → Added to user's profile
7. **Results displayed** → Shows score and details

## Features

- ✅ Real-time answer evaluation
- ✅ Automatic score calculation
- ✅ Score history tracking
- ✅ Add questions via UI
- ✅ Multiple question categories
- ✅ Timer for each question
- ✅ Progress tracking

## Testing

1. **Start quiz** - Go to Dashboard → Start New Quiz
2. **Answer questions** - Select answers and click Next
3. **Submit quiz** - Click Submit Quiz on last question
4. **View results** - See your score and percentage
5. **Check dashboard** - Score appears in history

## Adding Questions

1. **Via UI:**
   - Dashboard → Add Question → Fill form → Submit

2. **Via Script:**
   ```bash
   cd server
   npm run seed
   ```

## Notes

- Questions are evaluated server-side for security
- Answers are validated before submission
- Scores are automatically saved to user profile
- Questions can be added without admin access (for now)

