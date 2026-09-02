document.addEventListener('click', async (e) => {

    const icon = e.target.closest('.cart');

    if(!icon) {
        return;
    }

    e.preventDefault();

    const resuser = await fetch('/get-user');
    const datauser = await resuser.json();

    if(!datauser.user) {
        showmgs("Bạn Vui Lòng Đăng Nhập Để Sử Dụng Chức Năng Này !");
        return;
    }

    let productbox = icon.closest('.pro');

    let product_name = productbox.querySelector("h5").innerText;
    let price = productbox.querySelector("h4").innerText.replace(/\D/g, "");
    let image = productbox.querySelector("img").src;
    image = image.split("/images/")[1];

    const user_id = datauser.user.id;

        fetch('/add-cart', {
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
        })

        .then(res => res.text())
        .then(data => {
            if(data === "ok") {
                showmgs(`Bạn Đã Thêm Sản Phẩm ${product_name} Vào Giỏ Hàng`);

                const cartcount = document.querySelector('.cart-count');

                fetch(`/get-cart?user_id=${user_id}`)
                    .then(res => res.json())
                    .then(cart => {
                        let total = 0;

                        cart.forEach(item => {
                            total += item.quantity;
                        });

                        if(total > 0) {
                            cartcount.innerText = total;
                            cartcount.style.display = "flex";
                        }

                        else {
                            cartcount.style.display = "none";
                        }
                    });
            }

            else {
                showmgs("Lỗi Thêm Giỏ Hàng");
            }
        });
});

function showmgs(text){

    const mgs = document.querySelector('.mgs');

    mgs.innerText = text;
    mgs.style.display = 'block';

    setTimeout(() => {
        mgs.style.display = 'none';
    }, 2000);
}
