import React from "react";

export default function ResultTable({ keyword = "", user, onAdded }) { // nhận kw để tìm kiếm, user để thêm mới, onAdded là callback sau khi thêm
    const [users, setUsers] = React.useState([]); // users - mảng lưu danh sách người dùng
    const [loading, setLoading] = React.useState(true); // loading - trạng thái tải dữ liệu
    const [editing, setEditing] = React.useState(null); // editing - người dùng đang sửa

    // Tải dữ liệu 1 lần khi component mount ( quá trình khởi tạo render và gắn kết component đó vào DOM React)
    React.useEffect(() => {
        let isMounted = true;
        fetch("https://jsonplaceholder.typicode.com/users")
            .then((res) => res.json())
            .then((data) => {
                if (isMounted) {
                    setUsers(data); // Cập nhật state users với dữ liệu nhận được
                    setLoading(false); // Đặt loading về false sau khi dữ liệu đã tải xong
                }
            })
            .catch(() => setLoading(false));
        return () => {
            isMounted = false;
        };
    }, []);

    // Khi prop `user` thay đổi, thêm vào danh sách và gọi onAdded()
    React.useEffect(() => {
        if (user) { // user được AddUser truyền vào không null
            setUsers((prev) => [...prev, { ...user, id: prev.length + 1 }]);
            if (typeof onAdded === "function") onAdded();
        }
    }, [user, onAdded]);

    // Xóa người dùng theo id (không cần xác nhận), dùng filter để tạo mảng mới
    const removeUser = (id) => {
        setUsers((prev) => prev.filter((u) => u.id !== id));
        // Nếu đang sửa chính user bị xóa, đóng form sửa
        setEditing((prev) => (prev && prev.id === id ? null : prev));
    };

    // Bắt đầu sửa: deep copy user và address để tránh mutate dữ liệu gốc
    const editUser = (u) => {
        setEditing({ ...u, address: { ...u.address } });
    };

    // Cập nhật state editing mỗi khi thay đổi input
    const handleEditChange = (field, value) => {
        if (["street", "suite", "city"].includes(field)) {
            setEditing((prev) => ({
                ...prev,
                address: { ...(prev?.address || {}), [field]: value },
            }));
        } else {
            setEditing((prev) => ({ ...prev, [field]: value }));
        }
    };

    // Lưu người dùng sau khi chỉnh sửa
    const saveUser = () => {
        if (!editing) return;
        setUsers((prev) => prev.map((u) => (u.id === editing.id ? editing : u)));
        setEditing(null);
    };

    // Lọc danh sách theo keyword (không phân biệt hoa/thường)
    const kw = (keyword || "").toLowerCase();
    const filteredUsers = users.filter(
        (u) =>
            u.name.toLowerCase().includes(kw) ||
            u.username.toLowerCase().includes(kw)
    );

    if (loading) return <p>Đang tải dữ liệu...</p>;

    return (
        <div style={{ marginTop: 12 }}>
            <table className="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>City</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((u) => (
                        <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.name}</td>
                            <td>{u.username}</td>
                            <td>{u.email}</td>
                            <td>{u.address?.city || ""}</td>
                            <td>
                                <button onClick={() => editUser(u)}>Sửa</button>
                                <button className="btn-delete" onClick={() => removeUser(u.id)} style={{ marginLeft: 8 }}>
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {editing && (
                <div className="modal-overlay" onClick={() => setEditing(null)}>
                    <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h4>Sửa người dùng (ID: {editing.id})</h4>
                            <button className="btn-secondary" onClick={() => setEditing(null)} aria-label="Đóng">×</button>
                        </div>

                    <label htmlFor="edit-name">Name: </label>
                    <input
                        id="edit-name"
                        type="text"
                        value={editing.name || ""}
                        onChange={(e) => handleEditChange("name", e.target.value)}
                    />

                    <label htmlFor="edit-username">Username: </label>
                    <input
                        id="edit-username"
                        type="text"
                        value={editing.username || ""}
                        onChange={(e) => handleEditChange("username", e.target.value)}
                    />

                    <label htmlFor="edit-email">Email: </label>
                    <input
                        id="edit-email"
                        type="email"
                        value={editing.email || ""}
                        onChange={(e) => handleEditChange("email", e.target.value)}
                    />

                    <fieldset>
                        <legend>Address</legend>
                        <label htmlFor="edit-street">Street: </label>
                        <input
                            id="edit-street"
                            type="text"
                            value={editing.address?.street || ""}
                            onChange={(e) => handleEditChange("street", e.target.value)}
                        />
                        <label htmlFor="edit-suite">Suite: </label>
                        <input
                            id="edit-suite"
                            type="text"
                            value={editing.address?.suite || ""}
                            onChange={(e) => handleEditChange("suite", e.target.value)}
                        />
                        <label htmlFor="edit-city">City: </label>
                        <input
                            id="edit-city"
                            type="text"
                            value={editing.address?.city || ""}
                            onChange={(e) => handleEditChange("city", e.target.value)}
                        />
                    </fieldset>

                    <label htmlFor="edit-phone">Phone: </label>
                    <input
                        id="edit-phone"
                        type="text"
                        value={editing.phone || ""}
                        onChange={(e) => handleEditChange("phone", e.target.value)}
                    />

                    <label htmlFor="edit-website">Website: </label>
                    <input
                        id="edit-website"
                        type="text"
                        value={editing.website || ""}
                        onChange={(e) => handleEditChange("website", e.target.value)}
                    />

                        <div className="modal-actions">
                            <button className="btn-primary" onClick={saveUser}>Lưu</button>
                            <button className="btn-secondary" type="button" onClick={() => setEditing(null)}>
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}