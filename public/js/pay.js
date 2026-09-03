const cash = document.querySelector('.cash');
const QR = document.querySelector('.QR');
const text = document.querySelector('.text');

const bankBox = document.querySelector('.bank-box');
const banks = document.querySelectorAll('.bank');
const bankInfo = document.querySelector('.bank-info');

const bankName = document.querySelector('.bank-name');
const bankAccount = document.querySelector('.bank-account');
const bankTotal = document.querySelector('.bank-total');

let method = "COD";
let total = 0;
let product_id = null;

function getImageUrl(image) {
    if (!image) return "";

    image = String(image).trim();

    // Nếu là link đầy đủ
    if (image.startsWith("http://") || image.startsWith("https://")) {
        return image;
    }

    // Xóa / ở đầu
    image = image.replace(/^\/+/, "");

    // Xóa images/ nếu đã có
    image = image.replace(/^images\//, "");

    // Chuẩn hóa về /images/tên-ảnh
    return `/images/${image}`;
}

cash.addEventListener('click', () =>{

    method = "COD";

    text.style.display = "flex";
    bankBox.style.display = "none";

    cash.classList.add("active");
    QR.classList.remove("active");
});

QR.addEventListener('click', () =>{

    method = "QR";

    bankBox.style.display = "block";

    QR.classList.add("active");
    cash.classList.remove("active");
});

banks.forEach(bank => {
    bank.addEventListener('click', () => {
        banks.forEach(item => {
            item.classList.remove("selected");
        });

        bank.classList.add("selected");

        const nameBank = bank.dataset.bank;

        bankName.value = nameBank;
        bankTotal.value = (total + 30000).toLocaleString('vi-VN') + " VNĐ";

        bankInfo.style.display = "block";
    });

});

// Load dữ liệu giỏ hàng và hiển thị lên trang thanh toán
window.onload = loadPay;

async function loadPay() {

    const resUser = await fetch('/get-user');
    const dataUser = await resUser.json();

    document.querySelector(".name").value = dataUser.user.username;
    document.querySelector(".phone").value = dataUser.user.phone;
    document.querySelector(".email").value = dataUser.user.email;
    

    product_id = new URLSearchParams(window.location.search).get("product_id");
    
    const tp = document.querySelector('.tp');
    const a = document.querySelector('.a');
    const c = document.querySelector('.c');

    tp.innerHTML = '';

    total = 0;

    // Thanh toán 1 sản phẩm 

    if(product_id) {
        const resItem = await fetch(`/product/${product_id}`);
        const dataItem = await resItem.json();

        total = dataItem.price;

        tp.innerHTML += `
        
        <div class="pr">
            <div class="imga">
                <img src="${getImageUrl(dataItem.image)}" alt="Ảnh">
            </div>

            <div class="prduc">
                <h4>${dataItem.product_name}</h4>
                <h5>${dataItem.price.toLocaleString('vi-VN')} VNĐ</h5>
            </div>

            <p>x 1</p>
        </div>
        `;
    }

// Thanh toán giỏ hàng
    else {
        const resUser = await fetch('/get-user');
        const dataUser = await resUser.json();

    if(!dataUser.user){
        return;
    }

        const user_id = dataUser.user.id;

        const resCart = await fetch(`/get-cart?user_id=${user_id}`);
        const dataCart = await resCart.json();

        dataCart.forEach(item => {
            total += item.price * item.quantity;

            tp.innerHTML += `

            <div class="pr">
                <div class="imga">
                    <img src="${getImageUrl(item.image)}" alt="Ảnh">
                </div>

                <div class="prduc">
                    <h4>${item.product_name}</h4>
                    <h5>${item.price.toLocaleString('vi-VN')} VNĐ</h5>
            </div>
                <p>x ${item.quantity}</p>
            </div> 
            `;
        });
    }

    // Hiển thị tổng tiền

    a.innerText = total.toLocaleString('vi-VN') + " VNĐ";
    const ship = 30000;
    c.innerText = (total + ship).toLocaleString('vi-VN') + " VNĐ";

    bankTotal.value = (total + ship).toLocaleString('vi-VN') + " VNĐ";
}

const pay = document.querySelector(".pay");
pay.addEventListener('click', async (e) => {

    e.preventDefault();

    const name = document.querySelector(".name").value;
    const phone = document.querySelector(".phone").value;
    const email = document.querySelector(".email").value;
    const address = document.querySelector(".address").value;

    if(name === "" || phone === "" || email === "" || address === "") {
        show("Bạn Không Được Phép Để Trống ! ");
        return;
    }

    if(method === "QR") {
        if(!bankName.value) {
            show("Bạn Vui Lòng Chọn Ngân Hàng !");
            return;
        }
        
        if(bankAccount.value.trim() === "") {
            show("Bạn Vui Lòng Nhập Số Tài Khoản !");    
            return;  
        }
    }

    

    const resUser = await fetch('/get-user');
    const dataUser = await resUser.json();

    const ship = 30000;

    const res = await fetch('/createorder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            user_id: dataUser.user.id,
            name_receive: name,
            email: email,
            phone: phone,
            address: address,
            method: method,
            product_id: product_id,
            total: total + ship,
            bank_name: bankName.value,
            bank_account: bankAccount.value
        })
    });

    const result = await res.json();

    if(result.success) {
        document.querySelector(".name").value = "";
        document.querySelector(".phone").value = "";
        document.querySelector(".address").value = "";
        document.querySelector(".email").value = "";
        total = 0;
        document.querySelector('.tp').innerHTML = "";
        document.querySelector('.a').innerText = "0 VNĐ";
        document.querySelector('.c').innerText = "0 VNĐ";
        method = "COD";

        text.style.display = "flex";
        bankBox.style.display = "none";

        cash.classList.add("active");
        QR.classList.remove("active");

        banks.forEach(bank => {
            bank.classList.remove("selected");
        });

        bankInfo.style.display = "none";

        bankName.value = "";
        bankAccount.value = "";
        bankTotal.value = "";

        window.location.href = `/sucess.html?order_id=${result.order_id}`;
    }
});

function show(text) {
    const mgs = document.querySelector('.mgs');

    mgs.innerText = text;
    mgs.style.display = "block";

    setTimeout(() => {
       mgs.style.display = "none"; 
    }, 2000);
}

