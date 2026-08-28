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

    const search = document.getElementById("searchInput");

    search.addEventListener("keydown", function(e){
        if(e.key === "Enter") {
            const keyword = this.value;

            if(keyword === "") {
                return;
            }

            window.location.href = "search.html?keyword=" + keyword;
        }
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

async function loadProduct() {
    const res = await fetch('/products');
    const products = await res.json();
     console.log(products);

    products.sort(() => Math.random() - 0.5);

    const random = products.slice(0, 10);

    const productList = document.getElementById('productList');

    productList.innerHTML = "";

    random.forEach(product => {
        productList.innerHTML +=`
            <a href="spchitiet.html?product_id=${product.product_id}" class="tr">
                    <div class="kk">
                        <div class="pro">
                            <img src="images/${product.image}" alt="Ảnh">

                            <div class="pro1">
                                <h5>${product.product_name}</h5>

                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>

                                <h4>${product.price.toLocaleString("vi-VN")} VNĐ</h4>
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
            <a href="spchitiet.html?product_id=${product.product_id}" class="tr">
                    <div class="kk">
                        <div class="pro">
                            <img src="images/${product.image}" alt="Ảnh">

                            <div class="pro1">
                                <h5>${product.product_name}</h5>

                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>

                                <h4>${product.price.toLocaleString("vi-VN")} VNĐ</h4>
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

loadBest();