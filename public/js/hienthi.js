window.onload = loadCart;

let currentUserId = null;

async function updatecount() {
    const resUser = await fetch('/get-user');
    const dataUser = await resUser.json();

    const cartcount = document.querySelector('.cart-count');

    if(!cartcount) {
        return;
    }

    if(!dataUser.user) {
        cartcount.style.display = "none";
        return;
    }

    const user_id = dataUser.user.id;

    const res = await fetch(`/get-cart?user_id=${user_id}`);
    const cart = await res.json();

    let total = 0;

    cart.forEach(item => {
        total += item.quantity;
    });

    if(total > 0) {
        cartcount.innerText = total;
        cartcount.style.display = "flex";
    }

    else{
        cartcount.style.display = "none";
    }
}

async function loadCart() {
    const res = await fetch('/get-user');
    const data = await res.json();

    if(!data.user){
        return;
    }

    const user_id = data.user.id;
    currentUserId = user_id;

    const resCart = await fetch(`/get-cart?user_id=${user_id}`);
    const dataCart = await resCart.json();

    const listcart = document.querySelector('.listcart');
    listcart.innerHTML = `<h1>GIỎ HÀNG CỦA BẠN</h1>
                        <i class=" trash fa-solid fa-basket-shopping"></i>`;

    if(!dataCart || dataCart.length === 0) {
        listcart.innerHTML += 
            `   
                <p class="emty"><i class=" ca fa-solid fa-cart-arrow-down"></i> Giỏ Hàng Đang Trống !</p>
            `;
            updateTotal(dataCart);
            updatecount();
            return;
    }

    dataCart.forEach(function(item){
        listcart.innerHTML += 
            `
            <div class="cartt">
                <img src="/images/${item.image}" alt="Ảnh">
                <div class="item">
                    <h4>${item.product_name}</h4>
                    <h5>${item.price.toLocaleString('vi-VN')} VNĐ</h5>
                </div>
                <div class="nut">
                    <button class="tru"><i class="fa-solid fa-minus"></i></button> <span>${item.quantity}</span> <button class="cong"><i class="fa-solid fa-plus"></i></button>
                </div>
                <div class="active">
                    <button class="dele"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div> 
            `;
    });
    updateTotal(dataCart);
    updatecount();
}

document.addEventListener('click', async(e) => {
    const cartItem = e.target.closest('.cartt');

    if(!cartItem) {
        return;
    }

    const product_name = cartItem.querySelector('h4').innerText;

    // Tăng số lượng

    if(e.target.closest('.cong')) {
        await fetch('/increase', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: currentUserId,
                product_name
            })
        });
        loadCart();
        updatecount();
    }

    // Giảm số lượng

    if(e.target.closest('.tru')) {
        await fetch('/decrease', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                user_id: currentUserId,
                product_name
            })
        });
        loadCart();
        updatecount();
    }

    // Xóa 1 sản phẩm

    if(e.target.closest('.dele')) {
        await fetch('/remove-item', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: currentUserId,
                product_name 
            })
        });
        showalert(`Bạn Đã Xóa Sản Phẩm ${product_name} Khỏi Giỏ Hàng !`);
        loadCart();
        updatecount();
    }
});

    // Xóa tất cả sản phẩm

    document.querySelector('.removeA').addEventListener('click', async() => {

        const resCart = await fetch(`get-cart?user_id=${currentUserId}`);
        const dataCart = await resCart.json();

        if(!dataCart || dataCart.length === 0) {
            showalert("Giỏ Hàng Của Bạn Đang Trống ! ");
            return;
        }

        const box = document.querySelector('.confirm-box');

        box.style.display = "block";
    });

    document.addEventListener('click', async(e) => {
        
        if(e.target.closest('.no')) {
            document.querySelector('.confirm-box').style.display = "none";
            return;
        }

        if(e.target.closest('.yes')) {
            document.querySelector('.confirm-box').style.display ="none";

            await fetch('/remove-all', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            user_id: currentUserId
                        })   
                    });

                    showalert("Bạn Đã Xóa Tất Cả Sản Phẩm Trong Giỏ Hàng !");
                    loadCart();
                    updatecount();
            }
        });

        

    // Tông tiền

    function updateTotal(cart) {
        let total = 0;

        cart.forEach(function(item){
            total += item.price * item.quantity;
        });

        document.querySelector('.total').innerText = total.toLocaleString('vi-VN');
    }
    // Hiển thị thông báo

    function showalert(text){
        const mgs = document.querySelector('.mgs');

        mgs.innerText = text;
        mgs.style.display = "block";

        setTimeout(() => {
            mgs.style.display = "none";
        }, 2000);
    }

    document.querySelector('.pay').addEventListener('click', async() => {

        const resCart = await fetch(`/get-cart?user_id=${currentUserId}`);
        const dataCart = await resCart.json();

        if(!dataCart || dataCart.length === 0) {
            showalert("Giỏ Hàng Của Bạn Đang Trống ! ");
            return;
        }

        window.location.href = '/pay.html';
    });

