export default function SearchForm({ onChangeValue, value = "" }) { // Nhận 2 props: onChangeValue (hàm gọi khi input thay đổi), value (giá trị hiện tại của input)
    return (
        <input
            type="text"
            placeholder="Tìm theo name, username"
            aria-label="Tìm kiếm người dùng theo name hoặc username"
            value={value}
            onChange={(e) => onChangeValue(e.target.value)} // Gọi hàm onChangeValue với giá trị mới khi input thay đổi, việc lọc sẽ được xử lý ở component resulttable 
            className="search-input"
        />
    );
}
