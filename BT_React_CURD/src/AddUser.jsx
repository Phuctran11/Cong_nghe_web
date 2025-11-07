import React from "react";

function AddUser({ onAdd, adding, setAdding }) { 
    {/* Khởi tạo giá trị ban đầu cho biến user và state để quản lý trạng thái thay đổi realtime các trường định nghĩa*/}
    const [user, setUser] = React.useState({ 
        name: "",
        username: "",
        email: "",
        address: { street: "", suite: "", city: "" },
        phone: "",
        website: ""
    });

    {/* Xử lý thay đổi giá trị trong các ô input */}
    const handleChange = (e) => {
        const { id, value } = e.target; {/* lấy id-tên trường, value-giá trị từ input*/}
        if (["street", "suite", "city"].includes(id)) { // Đối với trường address có các trường con cần kiểm tra cập nhật lồng nhau
            setUser({ ...user, address: { ...user.address, [id]: value } }); {/* Cập nhật nested object address: deep copy -> ghi đè trường thay đổi */}
        } else { // cập nhật trường thông thường
            setUser({ ...user, [id]: value });
        }
    };
    {/* Xử lý khi người dùng nhấn nút Lưu (trường name và username bắt buộc)*/}
    const handleAdd = () => {
        if (user.name.trim() === "" || user.username.trim() === "") { // validate dữ liệu bắt buộc
            alert("Vui lòng nhập Name và Username!");
            return;
        }
        onAdd(user); // Gọi hàm onAdd từ props để thêm người dùng mới, app sẽ nhận và thêm vào danh sách (resulttable sẽ lắng nghe và hiển thị)
        setUser({ // Đặt lại form về trạng thái ban đầu sau khi thêm thành công
            name: "",
            username: "",
            email: "",
            address: { street: "", suite: "", city: "" },
            phone: "",
            website: ""
        });
        setAdding(false); // Đóng modal sau khi thêm xong
    };

    return (
        <div>
            {adding && (
                <div className="modal-overlay" onClick={() => setAdding(false)}>
                    <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h4>Thêm người dùng</h4>
                            <button className="btn-secondary" onClick={() => setAdding(false)} aria-label="Đóng">×</button>
                        </div>

                        <label htmlFor="name">Name: </label>
                        <input id="name" type="text" value={user.name} onChange={handleChange} />

                        <label htmlFor="username">Username: </label>
                        <input id="username" type="text" value={user.username} onChange={handleChange} />

                        <label htmlFor="email">Email: </label>
                        <input id="email" type="email" value={user.email} onChange={handleChange} />

                        <fieldset>
                            <legend>Address</legend>
                            <label htmlFor="street">Street: </label>
                            <input id="street" type="text" value={user.address.street} onChange={handleChange} />
                            <label htmlFor="suite">Suite: </label>
                            <input id="suite" type="text" value={user.address.suite} onChange={handleChange} />
                            <label htmlFor="city">City: </label>
                            <input id="city" type="text" value={user.address.city} onChange={handleChange} />
                        </fieldset>

                        <label htmlFor="phone">Phone: </label>
                        <input id="phone" type="text" value={user.phone} onChange={handleChange} />

                        <label htmlFor="website">Website: </label>
                        <input id="website" type="text" value={user.website} onChange={handleChange} />

                        <div className="modal-actions">
                            <button className="btn-primary" onClick={handleAdd}>Lưu</button>
                            <button className="btn-secondary" type="button" onClick={() => setAdding(false)}>
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AddUser;