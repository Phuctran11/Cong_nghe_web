// Bai 3 - modal chinh sua hoc sinh
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function EditStudentModal({ open, student, onClose, onUpdated, showToast }) {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [stuClass, setStuClass] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (student) {
            setName(student.name || '');
            setAge(student.age ?? '');
            setStuClass(student.class || '');
        }
    }, [student]);

    if (!open) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const payload = { name: name.trim(), age: Number(age), class: stuClass.trim() };
            const resp = await axios.put(`http://localhost:5000/api/students/${student._id || student.id}`, payload, {
                headers: { 'Content-Type': 'application/json' }
            });
            onUpdated(resp.data);
            if (typeof showToast === 'function') {
                showToast('Cập nhật học sinh thành công', 'success', 3000);
            }
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Lỗi khi cập nhật');
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    const overlayStyle = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 };
    const boxStyle = { background: '#fff', borderRadius: 8, boxShadow: '0 12px 32px rgba(0,0,0,0.12)', width: '100%', maxWidth: 520, padding: 20 };

    return (
        <div style={overlayStyle} onClick={onClose}>
            <div style={boxStyle} onClick={(e) => e.stopPropagation()}>
                <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12}}>
                    <h3 style={{margin:0}}>Chỉnh sửa học sinh</h3>
                    <button onClick={onClose} style={{border:0, background:'transparent', fontSize:20}}>&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div style={{marginBottom:10}}>
                        <label>Họ tên</label>
                        <input value={name} onChange={e => setName(e.target.value)} required style={{width:'100%', padding:8, borderRadius:6, border:'1px solid #ddd'}} />
                    </div>
                    <div style={{marginBottom:10}}>
                        <label>Tuổi</label>
                        <input type="number" value={age} onChange={e => setAge(e.target.value)} required min="1" style={{width:'100%', padding:8, borderRadius:6, border:'1px solid #ddd'}} />
                    </div>
                    <div style={{marginBottom:10}}>
                        <label>Lớp</label>
                        <input value={stuClass} onChange={e => setStuClass(e.target.value)} required style={{width:'100%', padding:8, borderRadius:6, border:'1px solid #ddd'}} />
                    </div>
                    {error && <div style={{color:'#721c24', background:'#f8d7da', padding:8, borderRadius:6}}>{error}</div>}
                    <div style={{display:'flex', justifyContent:'flex-end', gap:8, marginTop:8}}>
                        <button type="button" onClick={onClose} style={{padding:'8px 12px', borderRadius:6, background:'#e6e6e6'}}>Hủy</button>
                        <button type="submit" disabled={loading} style={{padding:'8px 12px', borderRadius:6, background:'#596be6', color:'#fff'}}>{loading ? 'Đang lưu...' : 'Lưu'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
