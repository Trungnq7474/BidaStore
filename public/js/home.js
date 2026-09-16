async function checklogin() {
    const res = await fetch('/get-user');
    const data = await res.json();

    const btn = document.querySelector('.btn');
    if (!btn) {
        return;
    }
    if (data.user) {
        btn.innerText = "CHÀO MỪNG " + data.user.username + " ĐẾN VỚI SHOPBIDA";
        btn.classList.add("chaouser");
    } 
    else {
        btn.style.display ="block";
        btn.classList.remove("chaouser");
    }
}

checklogin();

async function upChat() {
    const resUser = await fetch('/get-user');
    const dataUser = await resUser.json();

    const chat = document.querySelector('.chat-count');

    if(!chat) {
        return;
    }

    if(!dataUser.user) {
        chat.style.display = "none";
        return;
    }

    const user_id = dataUser.user.id;

    const res = await fetch(`/getread/${user_id}`);
    const total = await res.json();

    if(total > 0) {
        chat.innerText = total;
        chat.style.display = "flex";
    }

    else {
        chat.style.display = "none";
    }
}

upChat();

// ===============================
// 7️⃣ SCROLL DANH SÁCH SẢN PHẨM
// ===============================

// Lấy danh sách sản phẩm
const DanhSach = document.querySelector(".nq");

// Lấy 1 ảnh để tính độ rộng
const HinhAnh = document.querySelector(".nq img");

 // Lấy chiều rộng 1 sản phẩm
 const SoLuongCuon = HinhAnh.offsetWidth;

// Nút trái
document.querySelector(".trai").addEventListener("click", () => {
        DanhSach.scrollLeft -= SoLuongCuon;
    });

    // Nút phải
document.querySelector(".phai").addEventListener("click", () => {
        DanhSach.scrollLeft += SoLuongCuon;
    });

const mess = document.querySelector('.mes');
mess.addEventListener('click', async function(e) {
    e.preventDefault();

    if(!mess) {
        return;
    }

    const res = await fetch('/get-user');
    const data = await res.json();

    if(!data.user) {
        show("Bạn Phải Đăng Nhập Để Sử Dụng Chức Năng Này !");
        return;
    }

    window.location.href = '/chat.html';
});

function show(text) {
    const mgs = document.querySelector('.mgs');

    mgs.innerText = text;
    mgs.style.display = "block";
    
    setTimeout(() => {
        mgs.style.display = "none";
    }, 2000);
}

async function loadPromotion() {
    const res = await fetch('/products');
    const products = await res.json();

    const promotionProducts = products.filter(product => {
        return product.discount > 0 && product.new_price;
    });

    promotionProducts.sort(() => Math.random() - 0.5);
    const random = promotionProducts;

    const promotionList = document.getElementById('promotionList');

    promotionList.innerHTML = ""
    random.forEach(product => {
        promotionList.innerHTML +=`
            <a href="spchitiet.html?product_id=${product.product_id}" class="tr promotion-product">
                <div class="kk">
                    <div class="pro">
                        <img src="images/${product.image}" alt="Ảnh">

                        <span class="discount-user">- ${product.discount}%</span>

                        <div class="pro1">
                            <h5>${product.product_name}</h5>

                            ${getStars(product.average_rating)}

                            <div class="price-box">
                                <h4 class="price-old">${product.price.toLocaleString("vi-VN")} VNĐ</h4>
                                <h4 class="price-new">${product.new_price.toLocaleString("vi-VN")} VNĐ</h4>
                            </div>

                            <p class="stock ${product.stock > 0 ? 'con-hang' : 'het-hang'}">
                                ${product.stock > 0 ? `Còn ${product.stock} Sản Phẩm` : "Đã Hết Hàng"}
                            </p>
                        </div>

                        <span class="cart">
                            <i class="fas fa-shopping-cart"></i>
                        </span>
                    </div>
                </div>
            </a>
        `;
    });
}   

async function loadProduct() {
    const res = await fetch('/products');
    const products = await res.json();

    const normalProducts = products.filter(product => {
        return !(product.discount > 0 && product.new_price);
    });

    normalProducts.sort(() => Math.random() - 0.5);

    const random = normalProducts.slice(0, 10);

    const productList = document.getElementById('productList');

    productList.innerHTML = "";

    random.forEach(product => {
        productList.innerHTML +=`
            <a href="spchitiet.html?product_id=${product.product_id}" class="tr">
                    <div class="kk">
                        <div class="pro">
                            <img src="images/${product.image}" alt="Ảnh">

                            ${product.discount ? `<span class="discount-user">- ${product.discount}%</span>` : ""}

                            <div class="pro1">
                                <h5>${product.product_name}</h5>

                                ${getStars(product.average_rating)}

                                ${product.new_price
                                    ? `
                                        <div class="price-box">
                                            <h4 class="price-old">${product.price.toLocaleString("vi-VN")} VNĐ</h4>
                                            <h4 class="price-new">${product.new_price.toLocaleString("vi-VN")} VNĐ</h4>
                                        </div>
                                    `
                                    : `
                                        <h4>${product.price.toLocaleString("vi-VN")} VNĐ</h4>
                                    `
                                }
                                <p class="stock ${product.stock > 0 ? 'con-hang' : 'het-hang'}">
                                    ${product.stock > 0 ? `Còn ${product.stock} Sản Phẩm` : "Đã Hết Hàng"}
                                </p>
                            </div>

                            <span class="cart">
                                <i class="fas fa-shopping-cart"></i>
                            </span>
                        </div>
                    </div>
                </a>
        `;
    });
}

loadProduct();

async function loadBest() {
    const res = await fetch('/gettopten');
    const best = await res.json();

    const bestList = document.getElementById("bestList");
    bestList.innerHTML = "";

    best.forEach(product => {
        bestList.innerHTML +=`
            <a href="spchitiet.html?product_id=${product.product_id}" class="tr ${product.discount > 0 && product.new_price ? 'promotion-product' : ''}">
                    <div class="kk">
                        <div class="pro">
                            <img src="images/${product.image}" alt="Ảnh">

                            ${product.discount ? `<span class="discount-user">- ${product.discount}%</span>` : ""}

                            <div class="pro1">
                                <h5>${product.product_name}</h5>

                                ${getStars(product.average_rating)}

                                ${product.new_price
                                    ? `
                                        <div class="price-box">
                                            <h4 class="price-old">${product.price.toLocaleString("vi-VN")} VNĐ</h4>
                                            <h4 class="price-new">${product.new_price.toLocaleString("vi-VN")} VNĐ</h4>
                                        </div>
                                    `
                                    : `
                                         <h4>${product.price.toLocaleString("vi-VN")} VNĐ</h4>
                                    `
                                }
                                <p class="stock ${product.stock > 0 ? 'con-hang' : 'het-hang'}">
                                    ${product.stock > 0 ? `Còn ${product.stock} Sản Phẩm` : "Đã Hết Hàng"}
                                </p>
                            </div>

                            <span class="cart">
                                <i class="fas fa-shopping-cart"></i>
                            </span>
                        </div>
                    </div>
                </a>
        `;
    });
}

loadPromotion();
loadBest();

const filterBtn = document.getElementById("filterBtn");
const filterBox = document.getElementById("filterBox");
const filterProduct = document.getElementById("filterProduct");
const applyFilter = document.getElementById("applyFilter");

filterBtn.addEventListener("click", () => {
    filterBox.classList.toggle("show");
    filterBtn.classList.toggle("active");
});

applyFilter.addEventListener('click', async function() {
    const category = filterProduct.value;
    const minPrice = document.getElementById("minPrice").value;
    const maxPrice = document.getElementById("maxPrice").value;
    const sort = document.getElementById("sortPrice").value;

    if(category === "") {
        show("Bạn Chưa Chọn Sản Phẩm Để Lọc !");
        return;
    }

    document.getElementById("promotionTitle").style.display = "none";
    document.getElementById("promotionList").style.display = "none";

    document.getElementById("bestTitle").style.display = "none";
    document.getElementById("bestList").style.display = "none";

    const titles = document.querySelectorAll(".ok h1");

    titles.forEach(title => {
        if(title.innerText === "SẢN PHẨM NỔI BẬT") {
            title.innerText = "TẤT CẢ SẢN PHẨM";
        }
    });

    const res =  await fetch('/products');
    const data = await res.json();

    if(sort === "asc") {
        data.sort((a,b) => a.price - b.price);
    }

    if(sort === "desc") {
        data.sort((a,b) => b.price - a.price);
    }

    const productList = document.getElementById('productList');

    productList.innerHTML = "";

    data.forEach(product => {
        if(product.category === category && (!minPrice || product.price >= minPrice) && (!maxPrice || product.price <= maxPrice)) {
            productList.innerHTML +=`
                <a href="spchitiet.html?product_id=${product.product_id}" class="tr ${product.discount > 0 && product.new_price ? 'promotion-product' : ''}">
                    <div class="kk">
                        <div class="pro">
                            <img src="images/${product.image}" alt="Ảnh">

                            ${product.discount ? `<span class="discount-user">- ${product.discount}%</span>` : ""}

                            <div class="pro1">
                                <h5>${product.product_name}</h5>

                                ${getStars(product.average_rating)}

                                ${product.new_price
                                    ? `
                                        <div class="price-box">
                                            <h4 class="price-old">${product.price.toLocaleString("vi-VN")} VNĐ</h4>
                                            <h4 class="price-new">${product.new_price.toLocaleString("vi-VN")} VNĐ</h4>
                                        </div>
                                    `
                                    : `
                                         <h4>${product.price.toLocaleString("vi-VN")} VNĐ</h4>
                                    `
                                }
                                <p class="stock ${product.stock > 0 ? 'con-hang' : 'het-hang'}">
                                    ${product.stock > 0 ? `Còn ${product.stock} Sản Phẩm` : "Đã Hết Hàng"}
                                </p>
                            </div>

                            <span class="cart">
                                <i class="fas fa-shopping-cart"></i>
                            </span>
                        </div>
                    </div>
                </a>
            `;
        }
    });
});

const resetFilter = document.getElementById("resetFilter");

resetFilter.addEventListener('click', () => {
    filterProduct.value = "";

    document.getElementById("minPrice").value = "";
    document.getElementById("maxPrice").value = "";
    document.getElementById("sortPrice").value = "";

    const titles = document.querySelectorAll(".ok h1");

    titles.forEach(title => {
        if(title.innerText === "TẤT CẢ SẢN PHẨM") {
            title.innerText = "SẢN PHẨM NỔI BẬT";
        }
    });

    document.getElementById("promotionTitle").style.display = "block";
    document.getElementById("promotionList").style.display = "flex";

    document.getElementById("bestTitle").style.display = "block";
    document.getElementById("bestList").style.display = "flex";

    loadPromotion();
    loadProduct();
    loadBest();

});

function getStars(rating) {
    let stars = "";

    [1, 2, 3, 4, 5].forEach(i => {
        if(i <= rating) {
            stars += `<i class="fas fa-star"></i>`;
        }

        else {
            stars += `<i class="far fa-star"></i>`;
        }
    });

    return stars;
}