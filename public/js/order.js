function getImageUrl(image) {
    if (!image) return "";

    if (image.startsWith("http://") || image.startsWith("https://")) {
        return image;
    }

    image = image.replace(/^\/+/, "");
    image = image.replace(/^images\//, "");

    return `/images/${image}`;
}

async function tt(yt) {
    yt.classList.remove("cho", "dang", "xong", "huy");
    yt.classList.add(yt.value);

    const id = yt.dataset.id;
    const status = yt.value;

    const res = await fetch('/updatestatus', {
        method: 'PUT',
        headers: {
            'Content-Type' : 'application/json'
        },

        body: JSON.stringify({
            id: id,
            status: status
        })
    });

    const data = await res.text();
    if(data === "ok") {
        show(`Admin Đã Cập Nhật Trạng Thái Thành Công Cho Đơn Hàng ORD-00${id} !`);
    }

    if(data === "not") {
        show(`Admin Không Thể Cập Nhật Trạng Thái Này Cho Đơn Hàng ORD-00${id} !`);

        setTimeout(() => {
            location.reload();
        }, 2000);
       
    }
}

const selects = document.querySelectorAll("select");
selects.forEach(cc => {
    cc.classList.add(cc.value);
});

fetch('/getallorders')
    .then(res => res.json())
    .then(data => {
        const orderList = document.querySelector('.order-list');
        orderList.innerHTML = "";

        data.forEach(order => {
            orderList.innerHTML += `
                <tr data-filter="${order.method === "COD" ? "cod" : "qr"} ${order.status}">
                    <td>ORD-00${order.id}</td>
                    <td>${order.name_receive}</td>
                    <td>${order.total.toLocaleString('vi-VN')} VNĐ</td>
                    <td>${order.created_at.replace("T", " ").slice(0,16)}</td>
                    <td><b>${order.method}</b></td>
                    <td>
                        <select data-id="${order.id}" class="${order.status}"  onchange="tt(this)">
                            <option value="cho" ${order.status === "cho" ? "selected" : ""}>Chờ Xử Lý</option>
                            <option value="dang" ${order.status === "dang" ? "selected" : ""}>Đang Giao</option>
                            <option value="xong" ${order.status === "xong" ? "selected" : ""}>Hoàn Thành</option>
                            <option value="huy" ${order.status === "huy" ? "selected" : ""} >Đã Hủy</option>
                        </select>
                    </td>
                    <td>
                        <button class="edit" data-id="${order.id}"><i class="fa-solid fa-eye"></i> Chi Tiết</button>
                        <button class="delete" data-id="${order.id}"><i class="fa-solid fa-trash-can"></i> Xóa</button>
                    </td>
                </tr>
            `;
        });
    });

    document.addEventListener('click', function(e) {
        if(e.target.closest('.delete')){
            now = e.target.closest('tr')
            const id = e.target.closest('.delete').dataset.id;

            const box = document.querySelector('.confirm-box2');
            const yes = document.querySelector('.yes2');

            box.style.display = "block";

            yes.dataset.id = id;
        }

        if(e.target.closest('.no2')) {
            document.querySelector('.confirm-box2').style.display = "none";
        }

        if(e.target.closest('.yes2')) {
            const yes = e.target.closest('.yes2');
            const id = yes.dataset.id;

            document.querySelector('.confirm-box2').style.display = "none";

            fetch('/deleteorder', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: id
                    })
                })

                .then(res => res.text())
                .then(data => {
                    if(data === "ok") {
                        show(`Admin Đã Xóa Đơn Hàng ORD-00${id} Thành Công !`);
                        setTimeout(() => {
                            now.remove();
                        }, 2000);
                    }
                })
            }
        });

        


    const econ = document.querySelector('.econ');
    const inbox = document.querySelector('.box');
    econ.addEventListener('click', () => {
        inbox.style.display = "none";
    });

    document.addEventListener('click', async function(e) { 
        if(e.target.closest('.edit')) {
            const button = e.target.closest('.edit');
            const id = button.dataset.id;

            const res = await fetch(`/getorder/${id}`);
            const order = await res.json();

            const resitem = await fetch(`/getorderitems/${id}`);
            const items = await resitem.json();

            const productlist = document.querySelector('.product-list');
            productlist.innerHTML = "";
            
            items.forEach(item => {
                let imageUrl = item.image;

                // Nếu image đã là đường dẫn đầy đủ http
                if (imageUrl.startsWith("http")) {
                    imageUrl = imageUrl;
                } 
                // Nếu image là images/abc.png
                else {
                    imageUrl = "/" + imageUrl.replace(/^\/+/, "");
                }
                    productlist.innerHTML +=`
                    <div class="product-item">
                        <div class="product-info">
                            <img src="${getImageUrl(item.image)}" alt="Ảnh" class="product-img">
                            <div class="product-detail">
                                <h3 class="product-name">${item.product_name}</h3>
                                <h4 class="product-qty">Số lượng: x${item.quantity}</h4>
                            </div>
                        </div>
                        <span class="product-price">${item.price.toLocaleString('vi-VN')} VNĐ</span>
                    </div>
                `;
            });
            
            document.querySelector('.id').innerText = `ORD-00${order.id}`
            document.querySelector('.name').innerText = order.name_receive;
            document.querySelector('.email').innerText = order.email;
            document.querySelector('.phone').innerText = order.phone;
            document.querySelector('.address').innerText = order.address;
            document.querySelector('.method').innerText = order.method === "COD" ? "Tiền Mặt (COD)" : "Chuyển Khoản";

            const bankName = document.querySelector('.bank-name');
            const bankAccount = document.querySelector('.bank-account');

            if(order.method === "QR") {

                bankName.innerText = order.bank_name;
                bankAccount.innerText = order.bank_account;

                bankName.closest('.invoice-row').style.display = "flex";
                bankAccount.closest('.invoice-row').style.display = "flex";

            } else {

                bankName.innerText = "";
                bankAccount.innerText = "";

                bankName.closest('.invoice-row').style.display = "none";
                bankAccount.closest('.invoice-row').style.display = "none";

            }


            document.querySelector('.time').innerText = order.created_at.replace("T", " ").slice(0,16);
            document.querySelector('.price').innerText = order.total.toLocaleString('vi-VN') + " VNĐ";
            document.querySelector('.phone').innerText = order.phone;

            const voucherRow = document.querySelector('.voucher-row');
            const voucherCode = document.querySelector('.voucher-code');
            const voucherDiscount = document.querySelector('.voucher-discount');

            if(order.voucher) {
                let discount = 0;
                let productTotal = 0;

                items.forEach(item => {
                    productTotal += item.price * item.quantity;
                });

                if(order.voucher.type === "percent") {
                    discount = productTotal * order.voucher.value / 100;
                }

                else {
                    discount = order.voucher.value;
                }

                voucherCode.innerText = order.voucher.code;
                voucherDiscount.innerText = discount.toLocaleString('vi-VN') + " VNĐ";

                voucherRow.style.display = "flex";
            }

            else {
                voucherRow.style.display = "none";
            }


            inbox.style.display = "block";
        }
    });

    function show (text) {
        const mgs2 = document.querySelector('.mgs2');

        mgs2.innerText = text;
        mgs2.style.display = "block";

        setTimeout(() => {
            mgs2.style.display = "none";
        }, 2000);
    }
