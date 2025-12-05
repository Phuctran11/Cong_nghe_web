// Bai 1 dinh nghia model Student
import mongoose from 'mongoose';

const { Schema } = mongoose;

const studentSchema = new Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    class: { type: String, required: true }
}, { collection: 'students', timestamps: true });

// Export model as default (ESM)
export default mongoose.model('Student', studentSchema);
