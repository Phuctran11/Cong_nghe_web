// Bai2 - form them hoc sinh moi
import { useState } from 'react';
import axios from 'axios';

export default function AddStudentForm({ onAdd, showToast, searchBar = null }) {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [stuClass, setStuClass] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const reset = () => {
        setName('');
        setAge('');
        setStuClass('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const payload = { name: name.trim(), age: Number(age), class: stuClass.trim() };
            const resp = await axios.post('http://localhost:5000/api/students', payload, {
                headers: { 'Content-Type': 'application/json' }
            });
            const created = resp.data;
            if (onAdd) onAdd(created);
            reset();
            if (typeof showToast === 'function') showToast('Thêm học sinh thành công', 'success', 3000);
        } catch (err) {
            const msg = err.response?.data?.error || err.message || 'Lỗi khi thêm học sinh';
            setError(msg);
            if (typeof showToast === 'function') showToast(msg, 'error', 4000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="add-student-form">
            <div className="form-row">
                <div>
                    <input
                        type="text"
                        placeholder="Họ tên"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        type="number"
                        placeholder="Tuổi"
                        value={age}
                        onChange={e => setAge(e.target.value)}
                        required
                        min="1"
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Lớp"
                        value={stuClass}
                        onChange={e => setStuClass(e.target.value)}
                        required
                    />
                </div>
                        <div className="actions">
                            <button type="submit" disabled={loading} className="add-btn">
                                {loading ? 'Đang thêm...' : 'Thêm học sinh'}
                            </button>
                            {searchBar && (
                                <div className="search-inline">
                                    {searchBar}
                                </div>
                            )}
                        </div>
            </div>
            {error && <div className="error">{error}</div>}
        </form>
    );
}
