// Lấy các phần tử cần thiết
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const addProductBtn = document.getElementById('addProductBtn');
const addProductForm = document.getElementById('addProductForm');
const productList = document.getElementById('product-list');
const FALLBACK_IMG = '../Images/image_not_found.png';

// ---------------- LocalStorage helpers & rendering ----------------
function getStoredProducts() {
    try {
        const raw = localStorage.getItem('products');
        if (!raw) return null;
        const arr = JSON.parse(raw);
        return Array.isArray(arr) ? arr : null;
    } catch (e) {
        return null;
    }
}

function saveStoredProducts(arr) {
    localStorage.setItem('products', JSON.stringify(arr));
}

function buildProductArticle({ name, desc, price, image }) {
    const article = document.createElement('article');
    article.classList.add('product-item');

    const imgEl = document.createElement('img');
    imgEl.src = image || FALLBACK_IMG;
    imgEl.alt = `Hình ảnh sản phẩm ${name}`;
    imgEl.onerror = function () {
        this.onerror = null;
        this.src = FALLBACK_IMG;
    };

    const h3 = document.createElement('h3');
    h3.textContent = name;

    const pDesc = document.createElement('p');
    pDesc.textContent = desc;

    const pPrice = document.createElement('p');
    const priceNumber = typeof price === 'number' ? price : Number(price);
    const priceText = isNaN(priceNumber) ? (price || '') : priceNumber.toLocaleString('vi-VN');
    pPrice.textContent = `Giá: ${priceText} đ`;

    article.appendChild(imgEl);
    article.appendChild(h3);
    article.appendChild(pDesc);
    article.appendChild(pPrice);

    return article;
}

function renderProducts(arr) {
    // Xóa danh sách hiện tại (bao gồm các sản phẩm mẫu trong HTML)
    productList.innerHTML = '';
    arr.forEach(p => {
        const el = buildProductArticle(p);
        productList.appendChild(el);
    });
}

function initProducts() {
    const stored = getStoredProducts();
    if (stored && stored.length) {
        renderProducts(stored);
        return;
    }
    // Khởi tạo dữ liệu mẫu ban đầu nếu chưa có trong localStorage
    const defaults = [
        {
            name: 'Máy bay chiến đấu',
            desc: 'Loại: máy bay điều khiển từ xa/UAV nhỏ dùng huấn luyện. Đặc điểm: nhỏ gọn, dễ điều khiển, bay tầm ngắn.',
            price: 120000,
            image: '../Images/image1.png'
        },
        {
            name: 'Sukhoi Su-57',
            desc: 'Đặc điểm: tàng hình, siêu cơ động, tốc độ tối đa Mach 2. Ứng dụng: mục tiêu trên không, mặt đất và trên biển.',
            price: 150000,
            image: '../Images/image2.png'
        },
        {
            name: 'F-22 Raptor',
            desc: 'Đặc điểm: siêu âm, tàng hình, vũ khí tiên tiến. Ứng dụng: chiếm ưu thế trên không, tấn công mặt đất.',
            price: 130000,
            image: '../Images/image3.png'
        }
    ];
    saveStoredProducts(defaults);
    renderProducts(defaults);
}

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

// Xử lý submit form thêm sản phẩm với validate, render & lưu LocalStorage
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

    function finalizeAdd(finalImgSrc) {
        // Render lên UI (prepend để hiển thị đầu danh sách)
        const el = buildProductArticle({ name, desc, price: Number(price), image: finalImgSrc });
        productList.prepend(el);

        // Lưu vào LocalStorage (thêm mới vào đầu mảng)
        const current = getStoredProducts() || [];
        current.unshift({ name, desc, price: Number(price), image: finalImgSrc });
        saveStoredProducts(current);

        // Reset & ẩn form, cập nhật filter nếu đang có từ khóa
        addProductForm.reset();
        addProductForm.classList.add('hidden');
        errorMsg.textContent = '';
        filterProducts();
    }

    if (imageUrl) {
        const tester = new window.Image();
        tester.onload = function () {
            finalizeAdd(imageUrl);
        };
        tester.onerror = function () {
            finalizeAdd(FALLBACK_IMG);
        };
        tester.src = imageUrl;
    } else {
        finalizeAdd(FALLBACK_IMG);
    }
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

// Khởi tạo danh sách sản phẩm từ LocalStorage hoặc dữ liệu mẫu
initProducts();
