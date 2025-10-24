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

// Xử lý submit form thêm sản phẩm
addProductForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Lấy dữ liệu từ form (bao gồm URL ảnh nếu có)
    const name = document.getElementById('productName').value.trim();
    const desc = document.getElementById('productDesc').value.trim();
    const price = document.getElementById('productPrice').value.trim();
    const imageUrl = document.getElementById('productImage') ? document.getElementById('productImage').value.trim() : '';

    if (!name || !desc || !price) {
        alert('Vui lòng nhập đầy đủ thông tin sản phẩm');
        return;
    }

    // Tạo và thêm sản phẩm bằng DOM API (preload ảnh nếu user nhập URL)
    function createAndAppendProduct(finalImgSrc) {
        const article = document.createElement('article');
        article.classList.add('product-item');

        const imgEl = document.createElement('img');
        imgEl.src = finalImgSrc;
        imgEl.alt = `Hình ảnh sản phẩm ${name}`;
        // Nếu ảnh lỗi, luôn dùng ảnh image_not_found.png
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

        productList.appendChild(article);
    }

    const fallbackImg = '../Images/image_not_found.png';
    if (imageUrl) {
        // preload để kiểm tra URL (hỗ trợ https). Nếu load thành công, dùng imageUrl,
        // nếu lỗi hoặc timeout (5s) thì dùng placeholder.
        const tester = new window.Image();
        tester.onload = function() {
            createAndAppendProduct(imageUrl);
        };
        tester.onerror = function() {
            createAndAppendProduct(fallbackImg);
        };
        tester.src = imageUrl;
    } else {
        createAndAppendProduct(fallbackImg);
    }

    // Reset form và ẩn form
    addProductForm.reset();
    addProductForm.classList.add('hidden');

    // Tự động lọc lại danh sách theo từ khóa hiện tại (nếu có)
    filterProducts();
});
