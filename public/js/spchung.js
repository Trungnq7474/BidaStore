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

                                        ${getStars(product.average_rating)}

                                        <h4>${product.price.toLocaleString("vi-VN")} VNĐ</h4>
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

                                ${getStars(product.average_rating)}

                                <h4>${product.price.toLocaleString("vi-VN")} VNĐ</h4>
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
        })
    })
}

function getStars(rating) {
    let starts = "";

    [1, 2, 3, 4, 5].forEach(i => {
        if(i <= rating) {
            starts += `<i class="fas fa-star"></i>`;
        }

        else {
            starts += `<i class="far fa-star"></i>`
        }
    });

    return starts;
}
