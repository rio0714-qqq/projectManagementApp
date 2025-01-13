import mongoose from "mongoose";
interface IProjectDocument extends mongoose.Document {
  name: string;
  description?: string;
  customer: string;
  skills: string[];
  status: "新規" | "提案中" | "発注待ち" | "受注済" | "失注" | "継続" | "確認中";
  assignees: string[];
}

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    unique: true,
    trim: true,
    maxlength: [50, "Name cannot be more than 50 characters"],
  },
  description: {
    type: String,
    maxlength: [300, "Description cannot be more than 300 characters"],
  },
  customer: {
    type: String,
    required: [true, "Please add a customer"],
    maxlength: [50, "Description cannot be more than 300 characters"],
  },
  skills: {
    type: [String],
  },
  status: {
    type: String,
    required: true,
    enum: ["新規", "提案中", "発注待ち", "受注済", "失注", "継続", "確認中"],
    default: "新規",
  },
  assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IProjectDocument>("Project", ProjectSchema);
