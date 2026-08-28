const params = new URLSearchParams(window.location.search);
const category = params.get("category");
const title = document.querySelector(".category-title");

title.textContent = category.toUpperCase() + " CHẤT LƯỢNG CAO";

fetch(`/getprocate/${category}`)
    .then(res => res.json())
    .then(data => {
        const productList = document.querySelector('.sp');
        productList.innerHTML = "";

        data.forEach(product => {
            productList.innerHTML += `
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
        })
    })