# Quick Fix: Quiz Questions Not Displaying

## Most Likely Issue: No Questions in Database

### Solution: Add Questions

1. **Open terminal and navigate to server:**
   ```bash
   cd server
   ```

2. **Run the seed script:**
   ```bash
   npm run seed
   ```

3. **You should see:**
   ```
   ✅ Successfully inserted 30 questions!
   📋 Questions by category:
      General Knowledge: 5 questions
      Science: 5 questions
      ...
   ```

4. **Restart your server** (if it's running):
   ```bash
   npm start
   ```

5. **Test in browser:**
   - Go to: `http://localhost:8080/api/quiz/questions`
   - You should see JSON with questions

## If Questions Still Don't Show

### Check Server Logs

When you access the quiz page, check server console. You should see:
```
📋 Fetching quiz questions...
✅ Found X questions in database
📤 Sending X questions to client
```

### Check Browser Console

1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for error messages
4. Check Network tab for API requests

### Test API Directly

Open in browser:
```
http://localhost:8080/api/quiz/questions
```

Should return JSON with questions.

## Expected Behavior

After running `npm run seed`, you should have 30+ questions and they should display in your quiz app.

The improved error handling will now show you clear messages if:
- No questions exist
- API connection fails
- Any other errors occur

