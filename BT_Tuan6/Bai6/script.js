// Lấy các phần tử cần thiết
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const priceFilter = document.getElementById('priceFilter');
const sortBy = document.getElementById('sortBy');
const addProductBtn = document.getElementById('addProductBtn');
const addProductForm = document.getElementById('addProductForm');
const productList = document.getElementById('product-list');
const FALLBACK_IMG = '../Images/image_not_found.png';

// Modal elements
const modal = document.getElementById('productModal');
const modalClose = document.querySelector('.modal-close');
const modalImage = document.getElementById('modalImage');
const modalName = document.getElementById('modalName');
const modalDesc = document.getElementById('modalDesc');
const modalPrice = document.getElementById('modalPrice');

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
    pPrice.dataset.price = priceNumber; // Lưu giá số để filter/sort

    article.appendChild(imgEl);
    article.appendChild(h3);
    article.appendChild(pDesc);
    article.appendChild(pPrice);

    // Thêm sự kiện click để hiển thị modal
    article.addEventListener('click', () => {
        showProductModal({ name, desc, price, image });
    });

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

// Hàm lọc và sắp xếp sản phẩm
function filterAndSortProducts() {
    const keyword = searchInput.value.trim().toLowerCase();
    const priceRange = priceFilter.value;
    const sortOption = sortBy.value;
    
    let products = Array.from(productList.querySelectorAll('.product-item'));
    
    // Xóa thông báo cũ nếu có
    const oldNoResult = document.getElementById('noResult');
    if (oldNoResult) oldNoResult.remove();

    // Lọc theo tên và giá
    let visibleCount = 0;
    products.forEach(product => {
        const nameEl = product.querySelector('h3');
        const priceEl = product.querySelector('p[data-price]');
        if (!nameEl || !priceEl) {
            product.style.display = 'none';
            return;
        }

        const name = nameEl.textContent.toLowerCase();
        const price = Number(priceEl.dataset.price);
        
        let matchName = name.includes(keyword);
        let matchPrice = true;

        if (priceRange !== 'all') {
            const [min, max] = priceRange.split('-').map(Number);
            matchPrice = price >= min && price <= max;
        }

        if (matchName && matchPrice) {
            product.style.display = '';
            visibleCount++;
        } else {
            product.style.display = 'none';
        }
    });

    // Hiển thị thông báo nếu không có sản phẩm nào
    if (visibleCount === 0) {
        const noResult = document.createElement('p');
        noResult.id = 'noResult';
        noResult.textContent = 'Không có sản phẩm nào thỏa mãn điều kiện lọc.';
        productList.appendChild(noResult);
        return; // Không cần sắp xếp nếu không có sản phẩm
    }

    // Sắp xếp theo alphabet
    if (sortOption !== 'default') {
        const visibleProducts = products.filter(p => p.style.display !== 'none');
        
        visibleProducts.sort((a, b) => {
            const nameA = a.querySelector('h3').textContent;
            const nameB = b.querySelector('h3').textContent;
            const priceA = Number(a.querySelector('p[data-price]').dataset.price);
            const priceB = Number(b.querySelector('p[data-price]').dataset.price);

            switch(sortOption) {
                case 'name-asc':
                    return nameA.localeCompare(nameB, 'vi');
                case 'name-desc':
                    return nameB.localeCompare(nameA, 'vi');
                case 'price-asc':
                    return priceA - priceB;
                case 'price-desc':
                    return priceB - priceA;
                default:
                    return 0;
            }
        });

        // Render lại theo thứ tự mới
        visibleProducts.forEach(p => productList.appendChild(p));
    }
}


// Xử lý sự kiện tìm kiếm khi nhấn nút tìm
searchBtn.addEventListener('click', filterAndSortProducts);

// Xử lý sự kiện tìm kiếm khi gõ phím (keyup) trong ô tìm kiếm
searchInput.addEventListener('keyup', filterAndSortProducts);

// Xử lý sự kiện thay đổi bộ lọc giá
priceFilter.addEventListener('change', filterAndSortProducts);

// Xử lý sự kiện thay đổi sắp xếp
sortBy.addEventListener('change', filterAndSortProducts);

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
        // Lưu vào LocalStorage (thêm mới vào đầu mảng)
        const current = getStoredProducts() || [];
        current.unshift({ name, desc, price: Number(price), image: finalImgSrc });
        saveStoredProducts(current);

        // Render lại toàn bộ danh sách
        renderProducts(current);

        // Reset & ẩn form, cập nhật filter
        addProductForm.reset();
        addProductForm.classList.add('hidden');
        errorMsg.textContent = '';
        filterAndSortProducts();
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

// ================ MODAL FUNCTIONS ================

// Hiển thị modal chi tiết sản phẩm
function showProductModal({ name, desc, price, image }) {
    modalName.textContent = name;
    modalDesc.textContent = desc;
    
    const priceNumber = typeof price === 'number' ? price : Number(price);
    const priceText = isNaN(priceNumber) ? (price || '') : priceNumber.toLocaleString('vi-VN');
    modalPrice.textContent = `Giá: ${priceText} đ`;
    
    modalImage.src = image || FALLBACK_IMG;
    modalImage.alt = `Hình ảnh sản phẩm ${name}`;
    modalImage.onerror = function() {
        this.onerror = null;
        this.src = FALLBACK_IMG;
    };
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Ngăn scroll khi modal mở
}

// Đóng modal
function closeProductModal() {
    modal.classList.remove('show');
    document.body.style.overflow = ''; // Cho phép scroll lại
}

// Xử lý sự kiện đóng modal
modalClose.addEventListener('click', closeProductModal);

// Đóng modal khi click ra ngoài content
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeProductModal();
    }
});

// Đóng modal khi nhấn ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
        closeProductModal();
    }
});
