// Script to seed sample quiz questions
import mongoose from "mongoose";
import dotenv from "dotenv";
import Question from "../models/Question.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://raushankumarsingh18321_db_user:Hp7oNae98jBjzZ3U@cluster0.s9h1grl.mongodb.net/?appName=Cluster0";

const sampleQuestions = [
  // General Knowledge
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    answer: "Paris",
    category: "General Knowledge"
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    answer: "Mars",
    category: "General Knowledge"
  },
  {
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    answer: "Pacific Ocean",
    category: "General Knowledge"
  },
  {
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    answer: "Leonardo da Vinci",
    category: "General Knowledge"
  },
  {
    question: "What is the chemical symbol for water?",
    options: ["H2O", "CO2", "O2", "NaCl"],
    answer: "H2O",
    category: "Science"
  },
  
  // Science
  {
    question: "What is the speed of light in vacuum?",
    options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "200,000 km/s"],
    answer: "300,000 km/s",
    category: "Science"
  },
  {
    question: "What gas do plants absorb from the atmosphere?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
    answer: "Carbon Dioxide",
    category: "Science"
  },
  {
    question: "How many bones are in the human body?",
    options: ["196", "206", "216", "226"],
    answer: "206",
    category: "Science"
  },
  {
    question: "What is the hardest natural substance on Earth?",
    options: ["Gold", "Iron", "Diamond", "Platinum"],
    answer: "Diamond",
    category: "Science"
  },
  {
    question: "What is the smallest unit of matter?",
    options: ["Molecule", "Atom", "Cell", "Electron"],
    answer: "Atom",
    category: "Science"
  },
  
  // Technology
  {
    question: "What does 'HTML' stand for?",
    options: [
      "HyperText Markup Language",
      "High Tech Modern Language",
      "Home Tool Markup Language",
      "Hyperlink and Text Markup Language"
    ],
    answer: "HyperText Markup Language",
    category: "Technology"
  },
  {
    question: "Which company developed the JavaScript programming language?",
    options: ["Microsoft", "Google", "Netscape", "Apple"],
    answer: "Netscape",
    category: "Technology"
  },
  {
    question: "What does 'CPU' stand for?",
    options: [
      "Central Processing Unit",
      "Computer Personal Unit",
      "Central Program Utility",
      "Computer Processing Unit"
    ],
    answer: "Central Processing Unit",
    category: "Technology"
  },
  {
    question: "What is the most widely used database management system?",
    options: ["Oracle", "MySQL", "MongoDB", "PostgreSQL"],
    answer: "MySQL",
    category: "Technology"
  },
  {
    question: "What year was the World Wide Web invented?",
    options: ["1989", "1991", "1993", "1995"],
    answer: "1989",
    category: "Technology"
  },
  
  // History
  {
    question: "In which year did World War II end?",
    options: ["1943", "1944", "1945", "1946"],
    answer: "1945",
    category: "History"
  },
  {
    question: "Who was the first person to walk on the moon?",
    options: ["Buzz Aldrin", "Neil Armstrong", "Michael Collins", "Yuri Gagarin"],
    answer: "Neil Armstrong",
    category: "History"
  },
  {
    question: "In which year did the Berlin Wall fall?",
    options: ["1987", "1989", "1991", "1993"],
    answer: "1989",
    category: "History"
  },
  {
    question: "Which ancient civilization built the pyramids?",
    options: ["Greeks", "Romans", "Egyptians", "Mayans"],
    answer: "Egyptians",
    category: "History"
  },
  
  // Geography
  {
    question: "What is the tallest mountain in the world?",
    options: ["K2", "Mount Kilimanjaro", "Mount Everest", "Mount Fuji"],
    answer: "Mount Everest",
    category: "Geography"
  },
  {
    question: "Which is the longest river in the world?",
    options: ["Amazon", "Nile", "Mississippi", "Yangtze"],
    answer: "Nile",
    category: "Geography"
  },
  {
    question: "How many continents are there?",
    options: ["5", "6", "7", "8"],
    answer: "7",
    category: "Geography"
  },
  {
    question: "What is the smallest country in the world?",
    options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
    answer: "Vatican City",
    category: "Geography"
  },
  
  // Sports
  {
    question: "How many players are on a basketball team on the court at one time?",
    options: ["4", "5", "6", "7"],
    answer: "5",
    category: "Sports"
  },
  {
    question: "In which sport would you perform a slam dunk?",
    options: ["Football", "Basketball", "Volleyball", "Tennis"],
    answer: "Basketball",
    category: "Sports"
  },
  {
    question: "What is the duration of a standard soccer match?",
    options: ["80 minutes", "85 minutes", "90 minutes", "95 minutes"],
    answer: "90 minutes",
    category: "Sports"
  },
  
  // Math
  {
    question: "What is 15% of 200?",
    options: ["25", "30", "35", "40"],
    answer: "30",
    category: "Mathematics"
  },
  {
    question: "What is the square root of 64?",
    options: ["6", "7", "8", "9"],
    answer: "8",
    category: "Mathematics"
  },
  {
    question: "What is the value of π (pi) to two decimal places?",
    options: ["3.12", "3.14", "3.16", "3.18"],
    answer: "3.14",
    category: "Mathematics"
  },
  {
    question: "What is 2 to the power of 8?",
    options: ["128", "256", "512", "1024"],
    answer: "256",
    category: "Mathematics"
  }
];

async function seedQuestions() {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing questions (optional - comment out if you want to keep existing)
    const existingCount = await Question.countDocuments();
    console.log(`📊 Found ${existingCount} existing questions`);

    // Insert questions
    console.log("🌱 Seeding questions...");
    const result = await Question.insertMany(sampleQuestions, { ordered: false });
    console.log(`✅ Successfully inserted ${result.length} questions!`);

    // Display summary by category
    const categories = await Question.distinct("category");
    console.log("\n📋 Questions by category:");
    for (const category of categories) {
      const count = await Question.countDocuments({ category });
      console.log(`   ${category}: ${count} questions`);
    }

    console.log("\n🎉 Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    if (error.code === 11000) {
      console.log("⚠️  Some questions already exist. Skipping duplicates...");
      // Try inserting one by one to skip duplicates
      let inserted = 0;
      for (const question of sampleQuestions) {
        try {
          await Question.create(question);
          inserted++;
        } catch (err) {
          if (err.code !== 11000) {
            console.error("Error inserting question:", err.message);
          }
        }
      }
      console.log(`✅ Inserted ${inserted} new questions`);
    } else {
      console.error("❌ Error seeding questions:", error.message);
      console.error(error);
    }
    process.exit(1);
  }
}

// Run the seed function
seedQuestions();

