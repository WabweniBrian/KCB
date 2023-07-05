import mongoose from "mongoose";

const { Schema } = mongoose;

const slideSchema = new Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Slide = mongoose.models.Slide || mongoose.model("Slide", slideSchema);
export default Slide;
