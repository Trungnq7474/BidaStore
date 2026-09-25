const tab = document.querySelector('.tab');
const tab1 = document.querySelector('.tab1');
const tab2 = document.querySelector('.tab2');
const tab3 = document.querySelector('.tab3');
const tab4 = document.querySelector('.tab4');

const orderList = document.querySelector('.order-list');

let orders = [];

function getImageUrl(image) {
    if (!image) return "";

    if (image.startsWith("http://") || image.startsWith("https://")) {
        return image;
    }

    image = image.replace(/^\/+/, "");
    image = image.replace(/^images\//, "");

    return `/images/${image}`;
}

fetch('/getmyorder')
    .then(res => res.json())
    .then(data => {
        orders = data;

        showOrders(orders);
    });

async function showOrders(data) {
    orderList.innerHTML = "";
    for (const order of data) {
        let status = "";
        let statusClass = "";

        if(order.status === "cho") {
            status = "Đã Đặt";
            statusClass = "pending";
        }

        if(order.status === "dang") {
            status = "Đang Giao";
            statusClass = "shipping";
        }

        if(order.status === "xong") {
            status = "Đã Giao";
            statusClass = "done";
        }

        if(order.status === "huy") {
            status = "Đã Hủy";
            statusClass = "cancel";
        }

        const res = await fetch(`/getorderitems/${order.id}`);
        const items = await res.json();

        let product = "";

        items.slice(0,2).forEach(item => {
            product +=`
                <div class="top">
                    <img class="im" src="${getImageUrl(item.image)}" alt="Ảnh">
                    
                    <div class="tl">
                        <div class="info">
                            <h3>${item.product_name}</h3>
                            <p>Số lượng: x ${item.quantity}</p>
                        </div>
                        <div class="order-price">
                            ${item.discount > 0 && item.new_price ? `
                                <span class="price-old">${item.old_price.toLocaleString('vi-VN')} VNĐ</span>
                                <span class="price-new">${item.new_price.toLocaleString('vi-VN')} VNĐ</span>
                            ` : `
                                <span class="price-normal">${item.price.toLocaleString('vi-VN')} VNĐ</span>
                            `}
                        </div>
                    </div>
                </div>
            `;
        })

        if(items.length > 2) {
            product +=`
                <p class="other">+ ${items.length - 2} sản phẩm khác</p>
            `;
        }

        orderList.innerHTML +=`
            <div class="order1">
                <div class="firts">
                    <span class="md">Mã Đơn: ORD-00${order.id}</span>
                    <span class="status ${statusClass}">${status}</span>
                </div>

                ${product}
                <h3 class="total">Tổng: ${order.total.toLocaleString('vi-VN')} VNĐ</h3>
                
                <div class="act">
                    ${order.status === "cho" ? `<button class="huy" data-id="${order.id}">Hủy Đơn Hàng</button>` : ""}

                    ${order.status === "xong" || order.status === "huy" ? `<button class="mua-lai" data-id="${order.id}">Mua Lại</button>` : ""}

                   <button class="view ${order.status === "cho" || order.status === "dang" ? "view-order" : "view-journey"}" data-id="${order.id}">
                        ${order.status === "cho" || order.status === "dang" ? "Theo Dõi Đơn" : "Xem Hành Trình"}
                   </button>

                    <button class="xem" data-id="${order.id}">Xem Chi Tiết</button>
                </div>   
            </div>
        `;
    }
}

document.addEventListener('click', async function(e) {
    if(e.target.closest('.huy')) {
        const button = e.target.closest('.huy');
        const id = button.dataset.id;

        const box = document.querySelector('.confirm-box');
        const yes = document.querySelector('.yes');

        box.style.display = "block";
        yes.dataset.id = id;

    }

       
    if(e.target.closest('.no')) {
        document.querySelector('.confirm-box').style.display = "none";
    }

    if(e.target.closest('.yes')) {
        const id = e.target.closest('.yes').dataset.id;
        document.querySelector('.confirm-box').style.display = "none";

        const res = await fetch('/updatestatus', {
            method: 'PUT',
            headers: {
                'Content-Type' : 'application/json'
            },

            body: JSON.stringify({
                id: id,
                status: "huy",
                fromUser: true
            })
        });

        const data = await res.text();
        if(data === "ok") {
            show(`Bạn Đã Hủy Đơn Hàng ORD-00${id} Thành Công !`);
            const orderr = orders.find(order => order.id == id);
            orderr.status = "huy";
            showOrders(orders);
        }
    }     
}); 

document.addEventListener('click', async function(e) {
    if(e.target.closest('.xem')) {
        const button = e.target.closest('.xem');
        const id = button.dataset.id;

        const res = await fetch(`/getorder/${id}`);
        const order = await res.json();

        const st = document.querySelector('.status-value');

        st.classList.remove("pending", "shipping", "done", "cancel");

        if(order.status === "cho") {
            st.innerText = "Đã Đặt";
            st.classList.add("pending");
        }

        if(order.status === "dang") {
            st.innerText = "Đang Giao";
            st.classList.add("shipping");
        }

        if(order.status === "xong") {
            st.innerText = "Đã Giao";
            st.classList.add("done");
        }

        if (order.status === "huy") {
            st.innerText = "Đã Hủy";
            st.classList.add("cancel");
        }

        const resitem = await fetch(`/getorderitems/${id}`);
        const items = await resitem.json();

        document.querySelector('.id').innerText = `ORD-00${order.id}`;
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

            bankName.closest('.invoice-row').style.display = "none";
            bankAccount.closest('.invoice-row').style.display = "none";

        }

        document.querySelector('.time').innerText = order.created_at.replace("T", " ").slice(0, 16);
        document.querySelector('.pricee').innerText = order.total.toLocaleString('vi-VN') + " VNĐ";
        const voucherRow = document.querySelector('.voucher-row');
        const voucherCode = document.querySelector('.voucher-code');
        const voucherDiscount = document.querySelector('.voucher-discount');
        const voucherMinus = document.querySelector('.voucher-minus');
        const shippingMethod = document.querySelector('.shipping-method');
        const shippingFee = document.querySelector('.shipping-fee');

        let productTotal = 0;
        let promotionTotal = 0;

        items.forEach(item => {
            
            if(item.discount > 0 && item.new_price) {
                productTotal += item.new_price * item.quantity;
            }

            else {
                productTotal += item.price * item.quantity;
            }

            if(item.discount > 0 && item.old_price && item.new_price) {
                promotionTotal += (item.old_price - item.new_price) * item.quantity;
            }
        });

        document.querySelector('.product-total').innerText = productTotal.toLocaleString('vi-VN') + " VNĐ";
        const promotionRow = document.querySelector('.promotion-row');
        const promotionTotalElement = document.querySelector('.promotion-total');


        if(promotionTotal > 0) {
            promotionTotalElement.innerText = "- " + promotionTotal.toLocaleString('vi-VN') + " VNĐ";
            promotionRow.style.display = "flex";
        }

        else {
            promotionRow.style.display = "none";
        }

        if(order.shipping === 30000) {
            shippingMethod.innerText = "Giao Hàng Tiêu Chuẩn";
            shippingFee.innerText = "30.000 VNĐ";
        }
        else if(order.shipping === 50000) {
            shippingMethod.innerText = "Giao Hàng Nhanh";
            shippingFee.innerText = "50.000 VNĐ";
        }
        else {
            shippingMethod.innerText = "Miễn Phí Giao Hàng";
            shippingFee.innerText = "Miễn Phí";
        }

        if(order.voucher) {
            let discount = 0;

            if(order.voucher.type === "percent") {
                discount = productTotal * order.voucher.value / 100;
            }
            
            else {
                discount = order.voucher.value;
            }

            voucherCode.innerText = order.voucher.code;
            voucherDiscount.innerText = discount.toLocaleString('vi-VN') + " VNĐ";
            voucherMinus.innerText = "- " + discount.toLocaleString('vi-VN') + " VNĐ";

            voucherRow.style.display = "flex";
        }

        else {
            voucherRow.style.display = "none";
        }

        const productList = document.querySelector('.product-list');
        productList.innerHTML = "";
        items.forEach(item => {
            productList.innerHTML +=`
                    <div class="product-item">
                        <div class="product-info">
                            <img src="${getImageUrl(item.image)}" alt="Ảnh" class="product-img">
                            <div class="product-detail">
                                <h3 class="product-name">${item.product_name}</h3>
                                <h4 class="product-qty">Số lượng: x${item.quantity}</h4>
                            </div>
                        </div>
                        <div class="product-price">
                            ${item.discount > 0 && item.new_price ? `
                                <span class="price-old">${item.old_price.toLocaleString('vi-VN')} VNĐ</span>
                                <span class="price-new">${item.new_price.toLocaleString('vi-VN')} VNĐ</span>
                            ` : `
                                <span class="price-normal">${item.price.toLocaleString('vi-VN')} VNĐ</span>
                            `}
                        </div>
                    </div>
            `;
        });

        document.querySelector('.box').style.display = "block";

    }
});

document.addEventListener('click', async function(e) {
    if(e.target.closest('.mua-lai')) {
        const button = e.target.closest('.mua-lai');
        const id  = button.dataset.id;

        const resuser = await fetch('/get-user');
        const datauser = await resuser.json();

        const user_id = datauser.user.id;

        const resorder = await fetch(`/getorderitems/${id}`);
        const items = await resorder.json();

        items.forEach(item => {

            let image = item.image;

            if(image) {
                image = image.replace(/^\/+/, "");
                image = image.replace(/^images\//, "");
            }

            fetch('/add-cart', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    user_id: user_id,
                    product_name: item.product_name,
                    price: item.price,
                    image: image
                })
            });
        });

            window.location.href = "../cart.html";
    }
});


const econ = document.querySelector('.econ');
const box = document.querySelector('.box');

econ.addEventListener('click', () => {
    box.style.display = "none";
});

tab.addEventListener('click', () => {
    tab.classList.add("active");
    tab1.classList.remove("active");
    tab2.classList.remove("active");
    tab3.classList.remove("active");
    tab4.classList.remove("active");
    
    showOrders(orders);
});

tab1.addEventListener('click', () => {
    tab1.classList.add("active");
    tab.classList.remove("active");
    tab2.classList.remove("active");
    tab3.classList.remove("active");
    tab4.classList.remove("active");
    
    showOrders(
        orders.filter(order => order.status === "cho")
    );

});

tab2.addEventListener('click', () => {
    tab2.classList.add("active");
    tab.classList.remove("active");
    tab1.classList.remove("active");
    tab3.classList.remove("active");
    tab4.classList.remove("active");
    
    showOrders(
        orders.filter(order => order.status === "dang")
    );
});

tab3.addEventListener('click', () => {
    tab3.classList.add("active");
    tab.classList.remove("active");
    tab1.classList.remove("active");
    tab2.classList.remove("active");
    tab4.classList.remove("active");
    
    showOrders(
        orders.filter(order => order.status === "xong")
    );
});

tab4.addEventListener('click', () => {
    tab4.classList.add("active");
    tab.classList.remove("active");
    tab1.classList.remove("active");
    tab2.classList.remove("active");
    tab3.classList.remove("active");
    
    showOrders(
        orders.filter(order => order.status === "huy")
    );
});

const tracking = document.querySelector('.tracking-overlay');
const trackingOrderId = document.querySelector('.tracking-order-id');
const statusText = document.querySelector('.tracking-status-text');
const statusIcon = document.querySelector('.tracking-status-icon i');
const statusIconBox = document.querySelector('.tracking-status-icon');
const trackingStatus = document.querySelector('.tracking-status');
const trackingCount = document.querySelector('.tracking-count');
const stepCho = document.querySelector('.tracking-step[data-status="cho"]');
const stepDang = document.querySelector('.tracking-step[data-status="dang"]');
const stepXong = document.querySelector('.tracking-step[data-status="xong"]');
const stepHuy = document.querySelector('.tracking-step[data-status="huy"]');
const cancelLine = document.querySelector('.cancel-line');
const lineDang = document.querySelector('.line-dang');
const lineCho = document.querySelector('.line-cho');
const close = document.querySelector('.tracking-close');
const trackingProductList = document.querySelector('.tracking-product-list');
const timeCho = document.querySelector('.time-cho');
const timeDang = document.querySelector('.time-dang');
const timeXong = document.querySelector('.time-xong');
const timeHuy = document.querySelector('.time-huy');

close.addEventListener('click', () => {
    tracking.style.display = "none";
});


document.addEventListener('click', async function(e) {
    if(e.target.closest('.view')) {
        const button = e.target.closest('.view');
        const id = button.dataset.id;

        trackingOrderId.innerText = id;

        const res = await fetch(`/getorder/${id}`);
        const order = await res.json();

        timeCho.innerText = order.created_at.replace("T", " ").slice(0, 16);

        timeDang.innerText = order.shipping_at
            ? order.shipping_at.replace("T", " ").slice(0, 16) : "";

        timeXong.innerText = order.delivered_at
            ? order.delivered_at.replace("T", " ").slice(0, 16) : "";

        timeHuy.innerText = order.cancelled_at
            ? order.cancelled_at.replace("T", " ").slice(0, 16) : "";

        const itemRes = await fetch(`/getorderitems/${id}`);
        const items = await itemRes.json();

        trackingProductList.innerHTML = "";

        trackingCount.innerText = items.length;

        items.forEach(item => {
            trackingProductList.innerHTML += `
                <div class="tracking-product-item">

                    <div class="tracking-product-info">
                        <img class="tracking-product-img" src="${getImageUrl(item.image)}" alt="Ảnh">

                        <div class="tracking-product-detail">
                            <h4 class="tracking-product-name">
                                ${item.product_name}
                            </h4>

                            <p class="tracking-product-qty">
                                Số lượng: x${item.quantity}
                            </p>
                        </div>
                    </div>

                    <div class="tracking-product-price">
                        ${item.discount > 0 && item.new_price
                            ? `
                                <span class="price-old">
                                    ${item.old_price.toLocaleString('vi-VN')} VNĐ
                                </span>

                                <span class="price-new">
                                    ${item.price.toLocaleString('vi-VN')} VNĐ
                                </span>
                            `
                            : `
                                <span class="price-normal">
                                    ${item.price.toLocaleString('vi-VN')} VNĐ
                                </span>
                            `
                        }
                    </div>

                </div>
            `;
        });

        stepCho.classList.remove("active");
        stepDang.classList.remove("active");
        stepXong.classList.remove("active");
        stepHuy.classList.remove("active");
        cancelLine.classList.remove("active");
        lineDang.classList.remove("active");
        statusText.classList.remove("status-cho", "status-dang", "status-xong", "status-huy");
        trackingStatus.classList.remove("status-cho", "status-dang", "status-xong", "status-huy");
        statusIconBox.classList.remove("status-cho", "status-dang", "status-xong", "status-huy");

        if(order.status === "cho") {
            stepCho.classList.add("active");
            lineCho.classList.add("active");
        }

        if(order.status === "dang") {
            stepCho.classList.add("active");
            stepDang.classList.add("active");
            lineCho.classList.add("active");
            lineDang.classList.add("active");
        }

        if(order.status === "xong") {
            stepCho.classList.add("active");
            stepDang.classList.add("active");
            stepXong.classList.add("active");
            lineCho.classList.add("active");
            lineDang.classList.add("active");
        }

        if(order.status === "huy") {
            stepCho.classList.add("active");
            stepHuy.classList.add("active");
            cancelLine.classList.add("active");
        }

        let currentStatus = "";

        if(order.status === "cho") {
            currentStatus = "Đã Đặt";
            statusText.classList.add("status-cho");
            statusIcon.className = "fa-solid fa-check";
            trackingStatus.classList.add("status-cho");
            statusIconBox.classList.add("status-cho");
        }

        if(order.status === "dang") {
            currentStatus = "Đang Giao";
            statusText.classList.add("status-dang");
            statusIcon.className = "fa-solid fa-truck-fast";
            trackingStatus.classList.add("status-dang");
            statusIconBox.classList.add("status-dang");
        }

        if(order.status === "xong") {
            currentStatus = "Đã Giao";
            statusText.classList.add("status-xong");
            statusIcon.className = "fa-solid fa-house-circle-check";
            trackingStatus.classList.add("status-xong");
            statusIconBox.classList.add("status-xong");
        }

        if(order.status === "huy") {
            statusText.classList.add("status-huy");
            currentStatus = "Đã Hủy";
            statusIcon.className = "fa-solid fa-xmark";
            trackingStatus.classList.add("status-huy");
            statusIconBox.classList.add("status-huy");
        }

        statusText.innerText = currentStatus;

        tracking.style.display = "block";
        
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

