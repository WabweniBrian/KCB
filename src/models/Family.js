import mongoose from "mongoose";

const { Schema } = mongoose;

const familySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Family = mongoose.models.Family || mongoose.model("Family", familySchema);
export default Family;
