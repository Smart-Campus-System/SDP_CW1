import mongoose from 'mongoose';

const ModuleSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' }],
  completionPercentage: { type: Number, default: 0 },
});

export default mongoose.model('Module', ModuleSchema);
