const cart = document.querySelector('.cart');

    cart.addEventListener('click', async (e) => {
        e.preventDefault();

        const resuser = await fetch('/get-user');
        const datauser = await resuser.json();

        if(!datauser.user) {
            showmgs("Bạn Cần Đăng Nhập Để Sử Dụng Chức Năng Này !");
            return;
        }

        let productbox = cart.closest('.pro');

        let product_name = productbox.querySelector("h2").innerText;
        let price = productbox.querySelector("h3").innerText.replace(/\D/g, "");
        let image = productbox.querySelector("img").getAttribute("src");

        image = image.replace(/^\/+/, "");
        image = image.replace(/^images\//, "");

        const user_id = datauser.user.id;

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

            const data = await res.text();

            if(data === "ok") {
                showmgs(`Đã Thêm Sản Phẩm ${product_name} Vào Giỏ Hàng`);

                const resCart = await fetch(`get-cart?user_id=${user_id}`);
                const dataCart = await resCart.json();

                const cartCount = document.querySelector('.cart-count');

                let total = 0;

                dataCart.forEach(item => {
                    total += item.quantity;
                });

                cartCount.innerText = total;
                cartCount.style.display = "flex";
            }

            else { 
                showmgs("Lỗi Thêm Giỏ Hàng"); 
            }
            
});

document.querySelector('.pay').addEventListener('click', async (e) => {
    e.preventDefault();

    const resuser = await fetch('/get-user');
    const datauser = await resuser.json();

    if (!datauser.user) {
        showmgs("Bạn Vui Lòng Đăng Nhập Để Sử Dụng Chức Năng Này !");
        return;
    }

    window.location.href = `/pay.html?product_id=${product_id}`;
});

const product_id =new URLSearchParams(window.location.search).get("product_id");

fetch(`/product/${product_id}`)

.then(res => res.json())

.then(data => {

    document.getElementById("image").src =
    "images/" + data.image;

    document.getElementById("product_name").innerText =
    data.product_name;

    document.getElementById("price").innerText =
    Number(data.price).toLocaleString('vi-VN') + " VNĐ";

    document.getElementById("description").innerText =
    data.description;

});

const btn = document.querySelector('.btn-submit-comment');

btn.addEventListener('click', async () => {

    const resUser = await fetch('/get-user');
    const dataUser = await resUser.json();
    
    if (!dataUser.user) {
        showmgs("Bạn Vui Lòng Đăng Nhập Để Sử Dụng Chức Năng Này !");
        return;
    }

    const user_id = dataUser.user.id;
    const user_name = dataUser.user.username;

    const comment_text = document.querySelector('.comment-text').value;

    const rating = document.querySelector('.rating-input').value;

    if(comment_text === "" || rating === "0") {
        showmgs("Bạn Vui Lòng Nhập Đánh Giá Và Bình Luận !");
        return;
    }

    const res = await fetch("/addcomment", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json' 
        },

        body: JSON.stringify({
            product_id,
            user_id,
            user_name,
            comment_text,
            rating
        })
    });

    const data = await res.text();

    if(data == "ok"){
        showmgs("Đã Gửi Bình Luận Thành Công !");
        document.querySelector('.comment-text').value = "";
        document.querySelector('.rating-input').value = "0";
        loadComments();
    }

    else if(data === "not") {
        showmgs("Bạn Chưa Mua Sản Phẩm Này Nên Không Được Đánh Giá !")
    }

    else {
        showmgs("Lỗi Thêm Bình Luận !");
    }
});

async function checkBuy() {
    const commentForm = document.querySelector('.comment-form');

    const resUser = await fetch('get-user');
    const dataUser = await resUser.json();

    if(!dataUser.user) {
        return;
    }

    const user_id = dataUser.user.id;
    
    const res = await fetch(`/checkbuy?product_id=${product_id}&user_id=${user_id}`);

    const data = await res.text();

    if(data === "yes") {
        commentForm.style.display = "block";
    }

    else {
        commentForm.style.display = "none";
    }
}

async function loadComments() {
    
    const res = await fetch(`/getcomment/${product_id}`);
    const data = await res.json();

    const commentList = document.querySelector('.comments-list');

    commentList.innerHTML = "";

        if(data.length === 0) {
                commentList.innerHTML +=`
                    <p class="no-comment">Chưa Có Bình Luận Nào Cho Sản Phẩm Này !</p>
                `;
                return;
            }
        
        commentList.innerHTML = `
            <h3>Tất Cả Đánh Giá</h3>
        `;

    data.forEach(comment => {

        const n = comment.user_name.trim().split(" ");
        const avatar = (n.shift()[0] + n.pop()[0]).toUpperCase();

        commentList.innerHTML += 
        `
            <div class="comment-item">
                <div class="comment-header">
                    <div class="userimg"><span class="name">${avatar}</span></div>
                    <span class="user-name">${comment.user_name}</span>
                    <div class="user-rating">${'<i class="fa-solid fa-star"></i> '.repeat(comment.rating)}</div>
                    <span class="comment-date">${comment.created_at.replace("T", " ").slice(0,16)}</span>
                </div>
                <p class="comment-content">${comment.comment_text}</p>

            ${
                comment.shop_reply
                ? `
                    <div class="shop-reply-user">
                        <div class="shop">
                            <strong><i class="fa-solid fa-store"></i> Shop Phản Hồi: </strong>
                            <span class="reply-date">${comment.reply_at.replace("T", " ").slice(0,16)}</span>
                        </div>
                        
                        <p>${comment.shop_reply}</p>

                    </div>
                `: ""
            }
        </div>
        `;
    });
}

loadComments();
checkBuy();

function showmgs(text){
    const mgs = document.querySelector('.mgs');
    mgs.innerText = text;
    mgs.style.display = 'block';

    setTimeout(() => {
        mgs.style.display = 'none';
    }, 2000);
}







