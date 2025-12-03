# Quiz Questions Not Displaying - Troubleshooting Guide

## Quick Fix

### Step 1: Add Questions to Database

The most common reason questions don't display is because there are no questions in the database.

**Run this command to add sample questions:**

```bash
cd server
npm run seed
```

This will add 30+ sample quiz questions to your database.

### Step 2: Verify Questions Were Added

Check your server console logs. You should see:
```
✅ Successfully inserted X questions!
```

### Step 3: Restart Your Server

```bash
cd server
npm start
```

### Step 4: Test the API Endpoint

Open your browser and go to:
```
http://localhost:8080/api/quiz/questions
```

You should see a JSON response with questions.

### Step 5: Check Browser Console

1. Open your browser's Developer Tools (F12)
2. Go to the Console tab
3. Navigate to the Quiz page
4. Look for any error messages

## Common Issues and Solutions

### Issue 1: "No questions available"
**Solution:** Run `npm run seed` in the server directory to add questions

### Issue 2: API connection error
**Solution:** 
- Make sure your server is running on port 8080
- Check the API URL in `client/src/utils/api.jsx`
- Verify CORS is enabled in server

### Issue 3: Questions exist but not showing
**Solution:**
- Check browser console for JavaScript errors
- Check server logs for API request logs
- Verify the response format matches what the frontend expects

### Issue 4: Empty array returned
**Solution:**
- Questions might be in a different database
- Check MongoDB connection string
- Verify database name is correct

## Debugging Steps

### 1. Check Server Logs
When you load the quiz page, you should see in server logs:
```
📋 Fetching quiz questions...
✅ Found X questions in database
📤 Sending X questions to client
```

### 2. Check Browser Network Tab
1. Open Developer Tools (F12)
2. Go to Network tab
3. Navigate to Quiz page
4. Look for request to `/api/quiz/questions`
5. Check the response

### 3. Check Browser Console
Look for:
- Error messages
- Console.log output showing question data
- Network errors

## Testing the API Directly

Test if the API works by running:

```bash
curl http://localhost:8080/api/quiz/questions
```

Or open in browser:
```
http://localhost:8080/api/quiz/questions
```

You should see JSON with questions array.

## Expected Response Format

```json
{
  "questions": [
    {
      "_id": "...",
      "question": "What is the capital of France?",
      "options": ["London", "Berlin", "Paris", "Madrid"],
      "category": "General Knowledge"
    }
  ],
  "total": 30
}
```

## Still Not Working?

1. **Check MongoDB Connection**
   - Verify MongoDB URI in `.env` or `server.js`
   - Test MongoDB connection

2. **Check Database Name**
   - Make sure you're connecting to the correct database
   - Questions might be in a different collection

3. **Clear Browser Cache**
   - Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
   - Clear browser cache

4. **Check File Paths**
   - Make sure API base URL is correct
   - Verify routes are properly configured

## Quick Test Checklist

- [ ] Server is running (`npm start` in server directory)
- [ ] Questions exist in database (run `npm run seed`)
- [ ] API endpoint works (test in browser)
- [ ] Browser console shows no errors
- [ ] Network request to `/api/quiz/questions` succeeds
- [ ] Response contains questions array

## Need Help?

Check the server console logs and browser console for detailed error messages. The improved error handling will show you exactly what's wrong.

