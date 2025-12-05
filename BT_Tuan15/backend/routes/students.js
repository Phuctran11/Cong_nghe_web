// Bai 1 dinh nghia route /api/students
import express from 'express';
import Student from '../Student.js';

const router = express.Router();

// GET / -> trả về danh sách tất cả học sinh
router.get('/', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Bai 2 - thêm route tạo mới học sinh
// POST / -> tạo mới học sinh, xu ly du lieu tu body
router.post('/', async (req, res) => {
    try {
        const { name, age, class: className } = req.body;
        if (!name || age === undefined || !className) {
            return res.status(400).json({ error: 'Thiếu trường bắt buộc: name, age, class' });
        }

        const student = await Student.create({ name, age, class: className });
        return res.status(201).json(student);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Bai 3 - them route lay chi tiet va cap nhat hoc sinh
// GET /:id -> lấy chi tiết một học sinh
router.get('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ error: 'Student not found' });
        return res.json(student);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// PUT /:id -> cập nhật học sinh theo id
router.put('/:id', async (req, res) => {
    try {
        const data = req.body;
        const updated = await Student.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
        if (!updated) return res.status(404).json({ error: 'Student not found' });
        return res.json(updated);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});
    // DELETE /:id -> xóa học sinh theo id
    router.delete('/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const deleted = await Student.findByIdAndDelete(id);
            if (!deleted) {
                return res.status(404).json({ error: 'Student not found' });
            }
            return res.json({ message: 'Đã xóa học sinh', id: deleted._id });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    });

export default router;
