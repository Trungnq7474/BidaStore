const params = new URLSearchParams(window.location.search);
const keyword = params.get("keyword");

fetch('/search?keyword=' + keyword)
    .then(res => res.json())
    .then(data => {

        const list = document.querySelector('.list');
        const mess = document.querySelector('.mess');
        

        if (data.length === 0) {
            mess.innerText = 'Không Tìm Thấy Sản Phẩm "' + keyword + '"';
            return;
        }

        mess.innerText = 'Đã Tìm Thấy "' + data.length + '"  Sản Phẩm Cho : "' + keyword + '"';


        data.forEach(function(item){

            list.innerHTML += `
            
            <a href="spchitiet.html?product_id=${item.product_id}" class="tr">
                    <div class="kk">
                        <div class="pro">
                            <img src="images/${item.image}" alt="Ảnh">

                            <div class="pro1">
                                <h5>${item.product_name}</h5>

                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>

                                <h4>${item.price.toLocaleString("vi-VN")} VNĐ</h4>
                            </div>

                            <span class="cart">
                                <i class="fas fa-shopping-cart"></i>
                            </span>
                        </div>
                    </div>
                </a>
            `;
        });
        const cart = document.querySelectorAll('.cart');

        cart.forEach(function(icon){
            icon.addEventListener('click', async (e) => {
            e.preventDefault();

            const resuser = await fetch('/get-user');
            const datauser = await resuser.json();

            if(!datauser.user) {
                showmgs("Vui Lòng Đăng Nhập Để Sử Dụng Chức Năng Này !");
                return;
            }

            let productbox = icon.closest('.pro');

            let product_name = productbox.querySelector("h5").innerText;
            let price = productbox.querySelector("h4").innerText.replace(/\D/g, "");
            let image = productbox.querySelector("img").src;

            const user_id = datauser.user.id;

            try {
                const res = await fetch('/add-cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({
                        user_id,
                        product_name,
                        price,
                        image
                    })
                });
                showmgs(`Đã Thêm Sản Phẩm ${product_name} Vào Giỏ Hàng`);
            }
            
            catch(err) {
                showmgs("Lỗi Thêm Giỏ Hàng");
            }
        });
    });
});

function showmgs(text) {
    const mgs = document.querySelector('.mgs');
    mgs.innerText = text;
    mgs.style.display = "block";

    setTimeout(() => {
        mgs.style.display = "none";
    }, 2000);
}
