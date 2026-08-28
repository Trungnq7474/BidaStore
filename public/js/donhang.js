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
                        <h4 class="price">Giá: ${item.price.toLocaleString('vi-VN')} VNĐ</h4>
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
                status: "huy"
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
                        <span class="product-price">${item.price.toLocaleString('vi-VN')} VNĐ</span>
                    </div>
            `;
        });

        document.querySelector('.box').style.display = "block";

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

function show(text) {
    const mgs = document.querySelector('.mgs');

    mgs.innerText = text;
    mgs.style.display = "block";

    setTimeout(() => {
       mgs.style.display = "none"; 
    }, 2000);
}

