import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import AddStudentForm from './components/AddStudentForm';
import EditStudentModal from './components/EditStudentModal';
import Toast from './components/Toast';
import SearchBar from './components/SearchBar';

function App() {
  const [students, setStudents] = useState([]);
  const [lastAddedId, setLastAddedId] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortAsc, setSortAsc] = useState(true);

  const showToast = (message, type = 'success', duration = 3000) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type, duration }]);
    return id;
  };

  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  useEffect(() => {
    let mounted = true;
    axios.get('http://localhost:5000/api/students')
      .then(response => {
        if (mounted) setStudents(response.data || []);
      })
      .catch(err => {
        if (mounted) setError(err.message || 'Lỗi khi tải dữ liệu');
      })
      .finally(() => { if (mounted) setLoading(false); });

    return () => { mounted = false; };
  }, []);

  const handleDelete = async (id) => {
    if (!id) return;
    const ok = window.confirm('Bạn có chắc muốn xóa học sinh này?');
    if (!ok) return;
    try {
      await axios.delete(`http://localhost:5000/api/students/${id}`);
      setStudents(prev => prev.filter(s => (s._id || s.id) !== id));
      showToast('Đã xóa học sinh', 'success', 3000);
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Lỗi khi xóa';
      showToast(msg, 'error', 4000);
    }
  };

  // Bai4 - Lọc danh sách theo tên (không phân biệt hoa thường)
  const filteredStudents = (students || []).filter(s => {
    if (!searchTerm) return true;
    const name = (s.name || '').toString().toLowerCase();
    return name.includes(searchTerm.toLowerCase());
  });
  
  // Bai 6 -  Sắp xếp danh sách theo tên (A->Z hoặc Z->A)
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    const na = (a.name || '').toString().toLowerCase();
    const nb = (b.name || '').toString().toLowerCase();
    if (na < nb) return sortAsc ? -1 : 1;
    if (na > nb) return sortAsc ? 1 : -1;
    return 0;
  });

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-inner">
          <h1 className="app-title">Quản lý Học sinh</h1>
          <p className="app-subtitle">Quản lý danh sách, thêm, sửa, xóa và tìm kiếm học sinh</p>
        </div>
      </header>

      <main className="table-wrap">
        <AddStudentForm onAdd={(student) => {
          setStudents(prev => [student, ...prev]);
          setLastAddedId(student._id || student.id || null);
          setTimeout(() => setLastAddedId(null), 3000);// tat thong bao sau 3s
        }} showToast={showToast}
          searchBar={<SearchBar value={searchTerm} onChange={setSearchTerm} className="inline" />}
        />
        {loading && <p>Đang tải dữ liệu...</p>}
        {error && <p className="error">Lỗi: {error}</p>}

        {!loading && !error && (
          <div>
            <table className="students-table">
              <thead>
                <tr>
                  <th className="th-name">
                    <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:8}}>
                      <span>Họ tên</span>
                      <button
                        className="sort-btn sort-primary header-sort"
                        onClick={() => setSortAsc(prev => !prev)}
                        aria-label="Chuyển đổi sắp xếp theo tên"
                        title={sortAsc ? 'Sắp xếp A → Z' : 'Sắp xếp Z → A'}
                      >
                        <span className="sort-icon">{sortAsc ? '▲' : '▼'}</span>
                        <span className="sort-label">{sortAsc ? 'A → Z' : 'Z → A'}</span>
                      </button>
                    </div>
                  </th>
                  <th>Tuổi</th>
                  <th>Lớp</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {sortedStudents.length === 0 ? (
                  <tr><td colSpan="4" style={{textAlign:'center', padding:'20px'}}>Không có học sinh</td></tr>
                ) : (
                  sortedStudents.map(s => (
                    <tr key={s._id || s.id} className={(s._id || s.id) === lastAddedId ? 'highlight' : ''}>
                      <td>{s.name}</td>
                      <td>{s.age}</td>
                      <td>{s.class}</td>
                      <td>
                        <div className="actions-cell">
                          <button className="action-btn btn-edit" title="Sửa" onClick={() => { setEditingStudent(s); setIsEditOpen(true); }}>
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="currentColor" opacity="0.9"/><path d="M20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" fill="currentColor"/></svg>
                          </button>
                          <button className="action-btn btn-delete" title="Xóa" onClick={() => handleDelete(s._id || s.id)}>
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 7h12v13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7z" fill="currentColor" opacity="0.9"/><path d="M9 4h6l1 2H8l1-2z" fill="currentColor"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        <EditStudentModal // Bai3 - Hien thi pop-up chỉnh sửa
          open={isEditOpen}
          student={editingStudent}
          onClose={() => setIsEditOpen(false)}
          onUpdated={(updated) => {
            setStudents(prev => prev.map(s => ((s._id || s.id) === (updated._id || updated.id) ? updated : s)));
          }}
          showToast={showToast}
        />
        <div className="toast-container">
          {toasts.map(t => (
            <Toast key={t.id} {...t} onClose={removeToast} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
