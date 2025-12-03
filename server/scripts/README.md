# Quiz Question Seeding Script

This script adds sample quiz questions to your database.

## Usage

### Run the seed script:

```bash
cd server
npm run seed
```

Or directly:

```bash
node server/scripts/seedQuestions.js
```

## What it does

1. Connects to your MongoDB database
2. Adds 30+ sample quiz questions across multiple categories:
   - General Knowledge
   - Science
   - Technology
   - History
   - Geography
   - Sports
   - Mathematics

3. Skips duplicate questions if they already exist
4. Shows a summary of questions by category

## Sample Questions Included

The script includes questions like:
- Capital cities
- Science facts
- Technology trivia
- Historical events
- Geography questions
- Sports knowledge
- Math problems

## Notes

- The script will skip questions that already exist (based on question text)
- All questions include 4 multiple-choice options
- Questions are categorized for easy organization
- You can modify `seedQuestions.js` to add your own questions

## Adding Custom Questions

Edit `server/scripts/seedQuestions.js` and add questions in this format:

```javascript
{
  question: "Your question here?",
  options: ["Option 1", "Option 2", "Option 3", "Option 4"],
  answer: "Option 1", // Must match one of the options exactly
  category: "Category Name"
}
```

## Environment Variables

Make sure your `.env` file has:
```
MONGO_URI=your_mongodb_connection_string
```

Or the script will use the default connection string from `server.js`.

