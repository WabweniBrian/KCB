import mongoose from "mongoose";

const { Schema } = mongoose;

const bestStudentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  gradeScore: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
});

const unebStatsSchema = new Schema(
  {
    level: {
      type: String,
      required: true,
      enum: ["O-level", "A-level"],
    },
    totalStudents: {
      type: Number,
      required: true,
    },
    gradeStatistics: [
      {
        grade: {
          type: String,
          required: true,
        },
        numberOfStudents: {
          type: Number,
          required: true,
        },
      },
    ],
    bestStudents: [bestStudentSchema],
  },
  {
    timestamps: true,
  }
);

const UnebStats =
  mongoose.models.UnebStats || mongoose.model("UnebStats", unebStatsSchema);
export default UnebStats;
