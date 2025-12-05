// Bai 1 thiet lap may chu express co ban
import express from 'express'; // su dung import phu hop voi type module (defined in package.json)
import cors from 'cors'; 
import mongoose from 'mongoose';
// Routes
import studentsRouter from './routes/students.js';


// prefix: /api/students
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Register routes (mount router after app & middleware)
app.use('/api/students', studentsRouter);

// Health check
app.get('/', (req, res) => {
	res.json({ message: 'BT_Tuan15 backend running' });
});

// --- Kết nối MongoDB bằng mongoose ---
// Kết nối local: mongodb://localhost:27017/student_db
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/student_db';

mongoose.connect(MONGO_URI, { dbName: 'student_db' })
	.then(() => console.log('Đã kết nối MongoDB thành công'))
	.catch(err => console.error('Lỗi kết nối MongoDB:', err));

// Đóng kết nối khi process dừng
process.on('SIGINT', async () => {
	await mongoose.disconnect();
	process.exit(0);
});

app.listen(PORT, () => {
	console.log(`Server listening on http://localhost:${PORT}`);
});
