// backend/models/Question.js
import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    question: { 
      type: String, 
      required: true,
      trim: true,
      minlength: 5
    },
    options: { 
      type: [String], 
      required: true,
      validate: {
        validator: function(v) {
          return v && v.length >= 2 && v.length <= 6;
        },
        message: "Questions must have between 2 and 6 options"
      }
    },
    answer: { 
      type: String, 
      required: true,
      trim: true
    },
    image: { 
      type: String, 
      default: null 
    },
    category: { 
      type: String, 
      default: "General",
      index: true
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    },
  },
  {
    timestamps: true
  }
);

// Index for faster category queries
questionSchema.index({ category: 1, createdAt: -1 });

// Validation: answer must be one of the options
questionSchema.pre("save", function(next) {
  if (this.isModified("answer") || this.isModified("options")) {
    if (!this.options.includes(this.answer)) {
      return next(new Error("Answer must be one of the provided options"));
    }
  }
  next();
});

export default mongoose.model("Question", questionSchema);
