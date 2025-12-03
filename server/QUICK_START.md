# Quick Start Guide - Adding Quiz Questions

## Option 1: Using the Seed Script (Recommended)

### Step 1: Navigate to server directory
```bash
cd server
```

### Step 2: Run the seed script
```bash
npm run seed
```

This will add 30+ sample quiz questions to your database!

## Option 2: Add Questions Manually via MongoDB

You can also add questions directly to your MongoDB database using MongoDB Compass or the MongoDB shell.

### Question Format:
```json
{
  "question": "Your question here?",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "answer": "Option 1",
  "category": "General Knowledge",
  "image": null
}
```

**Important:** The `answer` must match one of the options exactly!

## Option 3: Create an Admin API Endpoint (Advanced)

If you want to add questions via API, you can create an admin endpoint in `quizController.js`:

```javascript
export const addQuestion = async (req, res) => {
  try {
    const { question, options, answer, category } = req.body;
    
    // Validation
    if (!question || !options || !answer) {
      return res.status(400).json({ msg: "Missing required fields" });
    }
    
    if (!options.includes(answer)) {
      return res.status(400).json({ msg: "Answer must be one of the options" });
    }
    
    const newQuestion = await Question.create({
      question,
      options,
      answer,
      category: category || "General"
    });
    
    res.status(201).json({ msg: "Question added", question: newQuestion });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
```

## Verify Questions

After seeding, check your questions:

1. **Via API:**
   ```
   GET http://localhost:8080/api/quiz/questions
   ```

2. **Check server logs** - The seed script shows a summary

3. **MongoDB Compass** - Connect and view the `questions` collection

## Categories Included

The seed script includes questions in:
- ✅ General Knowledge
- ✅ Science
- ✅ Technology
- ✅ History
- ✅ Geography
- ✅ Sports
- ✅ Mathematics

## Need More Questions?

1. Edit `server/scripts/seedQuestions.js`
2. Add your questions to the `sampleQuestions` array
3. Run `npm run seed` again (it will skip duplicates)

## Troubleshooting

### Error: Cannot connect to MongoDB
- Check your `MONGO_URI` in `.env` file
- Verify your MongoDB connection string is correct
- Check if MongoDB is accessible

### Error: Duplicate questions
- This is normal! The script skips duplicates automatically
- Check the console output to see how many were inserted

### No questions showing in quiz
- Verify questions were inserted (check MongoDB)
- Restart your server
- Check if the API endpoint is working

## Next Steps

1. ✅ Run `npm run seed` to add questions
2. ✅ Start your server: `npm start`
3. ✅ Test the quiz in your app!

