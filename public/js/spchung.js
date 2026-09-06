const params = new URLSearchParams(window.location.search);
const category = params.get("category");
const brand = params.get("brand");
const title = document.querySelector(".category-title");


if(brand) {
    title.textContent = "THƯƠNG HIỆU " + brand.toUpperCase() + " CHẤT LƯỢNG CAO";

    fetch('/products')
        .then(res => res.json())
        .then(data => {
            const productList = document.querySelector('.sp');

            productList.innerHTML = "";

            data.forEach(product => {
               if(product.product_name.toUpperCase().includes(brand.toUpperCase())) {
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
               } 
            });
        });
}

else if (category) {
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
}
