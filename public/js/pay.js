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
let selectedVoucher = null;
let discount = 0;
const c = document.querySelector('.c');

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
        bankTotal.value = (total + 30000 - discount).toLocaleString('vi-VN') + " VNĐ";

        bankInfo.style.display = "block";
    });

});

async function loadVouchers() {
    const res = await fetch('/getvouchers');
    const data = await res.json();

    const voucherList = document.querySelector('.voucher-list');

    voucherList.innerHTML = "";

    data.forEach(voucher => {
        if(voucher.is_active != 1) {
            return;
        }

        if(voucher.quantity <= 0) {
            return;
        }

        const now = new Date();

        const start = new Date(voucher.start_date.replace(" ", "T"));
        const end = new Date(voucher.end_date.replace(" ", "T"));

        if(now < start || now > end) {
            return;
        }

        if(total < voucher.min_order) {
            return
        }

        let text = "";
        if(voucher.type === 'percent') {
            text = 'Giảm ' + voucher.value + '%';
        }

        else {
            text = 'Giảm ' + voucher.value.toLocaleString('vi-VN') + ' VNĐ';
        }

        voucherList.innerHTML +=`
            <div class="voucher-item" data-id="${voucher.id}">
                <div class="voucher-code"><i class="fa-solid fa-ticket-simple"></i> ${voucher.code}</div>

                <div class="voucher-info">
                    <div class="voucher-min">
                        <b class="min">Đơn tối thiểu ${voucher.min_order.toLocaleString('vi-VN')} VNĐ</b>
                    </div>

                    <div class="voucher-date">
                        <b><p>Bắt Đầu: ${voucher.start_date.replace("T", " ").slice(0, 16)}</p></b>
                        <b><p>Kết Thúc: ${voucher.end_date.replace("T", " ").slice(0, 16)}</p></b>
                    
                    </div>
                </div>

                <div class="voucher-discount">${text}</div>
            </div>
        `;
    });

    const items = document.querySelectorAll('.voucher-item');
    items.forEach(item => {
        item.addEventListener('click', () => {
            items.forEach(v => {
                v.classList.remove('selected');
            });

            item.classList.add('selected');
            const id = item.dataset.id;

            selectedVoucher = data.find(v => v.id == id);
            
            reDuce();

            const ship = 30000;
            c.innerText = (total + ship - discount).toLocaleString('vi-VN') + " VNĐ";
            bankTotal.value = (total + ship - discount).toLocaleString('vi-VN') + " VNĐ"
        });
    });
}

function reDuce() {
    if(!selectedVoucher) {
        discount = 0;
        return;
    }

    if(selectedVoucher.type === "percent") {
        discount = total * selectedVoucher.value / 100;
    }
    else {
        discount = selectedVoucher.value;
    }

    if(discount > total) {
        discount = total;
    }
}

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
    c.innerText = (total + ship - discount).toLocaleString('vi-VN') + " VNĐ";

    bankTotal.value = (total + ship - discount).toLocaleString('vi-VN') + " VNĐ";

    loadVouchers();
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
            subtotal: total,
            total: total + ship- discount,
            voucher_id: selectedVoucher ? selectedVoucher.id : null,
            bank_name: bankName.value,
            bank_account: bankAccount.value
        })
    });

    const result = await res.json();

    if(result.message === "voucher_not_found") {
        show("Voucher Không Tồn Tại !");
        return;
    }

    if(result.message === "voucher_out") {
        show("Voucher Đã Hết Lượt Sử Dụng !");
        return;
    }

    if(result.message === "voucher_inactive") {
        show("Voucher Không Còn Hoạt Động !");
        return;
    }

    if(result.message === "voucher_min") {
        show("Đơn Hàng Không Đủ Điều Kiện Sử Dụng Voucher !");
        return;
    }

    if(result.message === "voucher_expired") {
        show("Voucher Đã Hết Hạn !");
        return;
    }

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

