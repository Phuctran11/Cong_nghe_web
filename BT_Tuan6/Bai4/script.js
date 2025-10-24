// Lấy các phần tử cần thiết
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const addProductBtn = document.getElementById('addProductBtn');
const addProductForm = document.getElementById('addProductForm');
const productList = document.getElementById('product-list');

// Hàm lọc sản phẩm theo tên
function filterProducts() {
    const keyword = searchInput.value.trim().toLowerCase();
    const products = productList.querySelectorAll('.product-item');

    products.forEach(product => {
        const nameEl = product.querySelector('h3');
        if (!nameEl) return;
        const name = nameEl.textContent.toLowerCase();
        if (name.includes(keyword)) {
            product.style.display = '';
        } else {
            product.style.display = 'none';
        }
    });
}

// Xử lý sự kiện tìm kiếm khi nhấn nút tìm
searchBtn.addEventListener('click', filterProducts);

// Xử lý sự kiện tìm kiếm khi gõ phím (keyup) trong ô tìm kiếm
searchInput.addEventListener('keyup', filterProducts);

// Xử lý toggle hiển thị form thêm sản phẩm
addProductBtn.addEventListener('click', () => {
    addProductForm.classList.toggle('hidden');
});

// Xử lý submit form thêm sản phẩm với validate và hiển thị lỗi rõ ràng
addProductForm.addEventListener('submit', function(e) {
    e.preventDefault();
    // Lấy các trường dữ liệu
    const name = document.getElementById('newName').value.trim();
    const desc = document.getElementById('newDesc').value.trim();
    const price = document.getElementById('newPrice').value.trim();
    const imageUrl = document.getElementById('newImage') ? document.getElementById('newImage').value.trim() : '';
    const errorMsg = document.getElementById('errorMsg');

    // Validate dữ liệu
    if (!name) {
        errorMsg.textContent = 'Tên sản phẩm không được để trống.';
        return;
    }
    if (!price || isNaN(price) || Number(price) <= 0) {
        errorMsg.textContent = 'Giá phải là số lớn hơn 0.';
        return;
    }
    if (!desc || desc.length < 10) {
        errorMsg.textContent = 'Mô tả phải từ 10 ký tự trở lên.';
        return;
    }
    errorMsg.textContent = '';

    // Tạo phần tử sản phẩm mới
    const fallbackImg = '../Images/image_not_found.png';
    function createAndPrependProduct(finalImgSrc) {
        const article = document.createElement('article');
        article.classList.add('product-item');

        const imgEl = document.createElement('img');
        imgEl.src = finalImgSrc;
        imgEl.alt = `Hình ảnh sản phẩm ${name}`;
        imgEl.onerror = function() {
            this.onerror = null;
            this.src = fallbackImg;
        };

        const h3 = document.createElement('h3');
        h3.textContent = name;

        const pDesc = document.createElement('p');
        pDesc.textContent = desc;

        const pPrice = document.createElement('p');
        pPrice.textContent = `Giá: ${price} đ`;

        article.appendChild(imgEl);
        article.appendChild(h3);
        article.appendChild(pDesc);
        article.appendChild(pPrice);

        // Thêm sản phẩm mới vào đầu danh sách
        productList.prepend(article);
    }

    if (imageUrl) {
        const tester = new window.Image();
        tester.onload = function() {
            createAndPrependProduct(imageUrl);
        };
        tester.onerror = function() {
            createAndPrependProduct(fallbackImg);
        };
        tester.src = imageUrl;
    } else {
        createAndPrependProduct(fallbackImg);
    }

    // Reset form và ẩn form
    addProductForm.reset();
    addProductForm.classList.add('hidden');
    errorMsg.textContent = '';

    // Tự động lọc lại danh sách theo từ khóa hiện tại (nếu có)
    filterProducts();
});

// Xử lý nút Hủy: ẩn form và reset lỗi
const cancelBtn = document.getElementById('cancelBtn');
if (cancelBtn) {
    cancelBtn.addEventListener('click', function() {
        addProductForm.classList.add('hidden');
        addProductForm.reset();
        const errorMsg = document.getElementById('errorMsg');
        if (errorMsg) errorMsg.textContent = '';
    });
}
