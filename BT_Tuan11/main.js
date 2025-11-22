const API_URL = 'https://jsonplaceholder.typicode.com/users';
// Trạng thái trong bộ nhớ (không lưu persistent)
let users = []; // toàn bộ user từ server
let filteredUsers = []; // user sau khi lọc/tìm kiếm
let currentPage = 1; // trang hiện tại
const usersPerPage = 5; // số user hiển thị mỗi trang
let editingUserId = null; // id của user đang được sửa

//   Lấy danh sách người dùng  
// Gọi GET tới API, cập nhật state và render lại UI
async function fetchUsers() {
    try {
        showLoading(true);
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Không thể tải dữ liệu');
        users = await response.json();
        filteredUsers = [...users];
        renderTable();
        showError('');
    } catch (error) {
        showError('Lỗi khi tải dữ liệu: ' + error.message);
    } finally {
        showLoading(false);
    }
}

//   Tạo người dùng mới  
// Gọi POST, cập nhật danh sách cục bộ và render
async function createUser(userData) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        if (!response.ok) throw new Error('Không thể thêm người dùng');
        const newUser = await response.json();
        newUser.id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        users.unshift(newUser);
        filteredUsers = [...users];
        renderTable();
            showError('');
            showSuccess('Thêm người dùng thành công');
        return true;
    } catch (error) {
        showError('Lỗi khi thêm người dùng: ' + error.message);
        return false;
    }
}

//   Cập nhật người dùng  
// Gọi PUT, cập nhật user trong bộ nhớ và render
async function updateUser(id, userData) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        if (!response.ok) throw new Error('Không thể cập nhật người dùng');
        const index = users.findIndex(u => u.id === id);
        if (index !== -1) {
            users[index] = { ...users[index], ...userData };
            filteredUsers = [...users];
            renderTable();
        }
        showError('');
        showSuccess('Cập nhật người dùng thành công');
        return true;
    } catch (error) {
        showError('Lỗi khi cập nhật người dùng: ' + error.message);
        return false;
    }
}

//   Xóa người dùng
// Gọi DELETE, loại bỏ khỏi bộ nhớ và render
async function deleteUser(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Không thể xóa người dùng');
        users = users.filter(u => u.id !== id);
        filteredUsers = filteredUsers.filter(u => u.id !== id);
        renderTable();
        showError('');
    } catch (error) {
        showError('Lỗi khi xóa người dùng: ' + error.message);
    }
}

//   Hiển thị bảng
// Tạo HTML cho trang hiện tại từ filteredUsers
function renderTable() {
    const tbody = document.getElementById('userTableBody');
    const start = (currentPage - 1) * usersPerPage;
    const end = start + usersPerPage;
    const paginatedUsers = filteredUsers.slice(start, end);

    if (paginatedUsers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="no-data">Không có dữ liệu</td></tr>';
    } else {
        tbody.innerHTML = paginatedUsers.map(user => `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td class="actions">
                    <button class="btn btn-edit" onclick="editUser(${user.id})">Sửa</button>
                    <button class="btn btn-delete" onclick="deleteUser(${user.id})">Xóa</button>
                </td>
            </tr>
        `).join('');
    }

    updatePagination();
}

//   Phân trang
// Cập nhật nút trước/sau và hiển thị thông tin trang
function updatePagination() {
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    document.getElementById('pageInfo').textContent = `Trang ${currentPage} / ${totalPages || 1}`;
    document.getElementById('prevBtn').disabled = currentPage === 1;
    document.getElementById('nextBtn').disabled = currentPage >= totalPages;
}

//   Tìm kiếm
// Lọc users theo tên và về trang 1
function searchUsers(query) {
    const searchTerm = query.toLowerCase().trim();
    filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm)
    );
    currentPage = 1;
    renderTable();
}

//   Modal: mở
// Nếu isEdit=true thì nạp dữ liệu user vào form
function openModal(isEdit = false, user = null) {
    const modal = document.getElementById('userModal');
    const title = document.getElementById('modalTitle');
    
    if (isEdit && user) {
        title.textContent = 'Sửa Người dùng';
        document.getElementById('userName').value = user.name;
        document.getElementById('userUsername').value = user.username;
        document.getElementById('userEmail').value = user.email;
        document.getElementById('userPhone').value = user.phone;
        editingUserId = user.id;
    } else {
        title.textContent = 'Thêm Người dùng';
        document.getElementById('userForm').reset();
        editingUserId = null;
    }
    
    modal.classList.add('show');
}

//   Modal: đóng
function closeModal() {
    document.getElementById('userModal').classList.remove('show');
    document.getElementById('userForm').reset();
    editingUserId = null;
}

//   Bắt đầu sửa người dùng
// Tìm user theo id và mở modal chỉnh sửa
function editUser(id) {
    const user = users.find(u => u.id === id);
    if (user) {
        openModal(true, user);
    }
}

//   Hiển thị lỗi
// Hiển thị message trong vùng error trên trang
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    if (message) {
        errorDiv.innerHTML = `<div class="error">${message}</div>`;
    } else {
        errorDiv.innerHTML = '';
    }
}

// Hiển thị thông báo thành công (tự ẩn sau timeout)
function showSuccess(message, timeout = 3000) {
    const errorDiv = document.getElementById('error-message');
    if (message) {
        errorDiv.innerHTML = `<div class="success">${message}</div>`;
        // tự ẩn sau timeout nếu nội dung chưa bị thay đổi
        setTimeout(() => {
            if (errorDiv.innerHTML && errorDiv.innerText.includes(message)) {
                errorDiv.innerHTML = '';
            }
        }, timeout);
    } else {
        errorDiv.innerHTML = '';
    }
}

//   Trạng thái loading
// Hiện/ẩn vùng loading, ẩn table khi đang tải
function showLoading(show) {
    document.getElementById('loading').style.display = show ? 'block' : 'none';
    document.getElementById('userTable').style.display = show ? 'none' : 'table';
}

//   Event listeners
document.getElementById('addUserBtn').addEventListener('click', () => openModal());
document.getElementById('closeModal').addEventListener('click', closeModal);
document.getElementById('cancelBtn').addEventListener('click', closeModal);

document.getElementById('searchInput').addEventListener('input', (e) => {
    searchUsers(e.target.value);
});

document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
    }
});

document.getElementById('nextBtn').addEventListener('click', () => {
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderTable();
    }
});

// Submit form: gọi create/update tuỳ trạng thái
document.getElementById('userForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userData = {
        name: document.getElementById('userName').value,
        username: document.getElementById('userUsername').value,
        email: document.getElementById('userEmail').value,
        phone: document.getElementById('userPhone').value
    };

    let success;
    if (editingUserId) {
        success = await updateUser(editingUserId, userData);
    } else {
        success = await createUser(userData);
    }

    if (success) {
        closeModal();
    }
});

// Đóng modal khi click bên ngoài
document.getElementById('userModal').addEventListener('click', (e) => {
    if (e.target.id === 'userModal') {
        closeModal();
    }
});

// Khởi tạo ứng dụng: tải dữ liệu ban đầu và render
fetchUsers();
