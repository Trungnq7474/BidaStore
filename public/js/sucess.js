window.onload = async function() {

    const order_id = new URLSearchParams(window.location.search).get("order_id");

    const res = await fetch(`/getorder/${order_id}`);
    const order = await res.json();

    const resItems = await fetch(`/getorderitems/${order_id}`);
    const items = await resItems.json();

    const invoice = document.querySelector(".invoice-box");

    let productList = "";

    items.forEach(item => {
        productList += `
            <div class="product-list">
                <div class="product-item">
                    <div class="product-info">
                        <img src="images/${item.image}" alt="Ảnh" class="product-img">
                        <div class="product-detail">
                            <h3 class="product-name">${item.product_name}</h3>
                            <h4 class="product-qty">Số lượng: x${item.quantity}</h4>
                        </div>
                    </div>
                    <span class="product-price">${item.price.toLocaleString('vi-VN')} VNĐ</span>
                </div>
            </div>
        `;
    });


    invoice.innerHTML = `
        <div class="invoice-title">
                <span>Mã Đơn: ORD-00${order.id} </span>
            </div>

            <div class="invoice-row">
                <span class="label"><i class="tt fa-solid fa-user"></i> <b>Người Nhận: <span class="text">${order.name_receive}</b></span></span>
            </div>

            <div class="invoice-row">
                <span class="label"><i class="tt fa-solid fa-envelope"></i> <b>Email: <span class="text">${order.email}</b></span></span>
            </div>
            
            <div class="invoice-row">
                <span class="label"><i class="tt fa-solid fa-phone"></i> <b>Số Điện Thoại: <span class="text">${order.phone}</b></span></span>
            </div>

            <div class="invoice-row">
                <span class="label"><i class="tt fa-solid fa-location-dot"></i> <b>Địa Chỉ Nhận: <span class="text">${order.address}</b></span></span>
            </div>

            <div class="invoice-row">
                <span class="label"><i class="tt fa-solid fa-credit-card"></i> <b>Phương Thức: <span class="text">${order.method === "COD" ? "Tiền Mặt (COD)": "Chuyển Khoản"}</b></span></span>
            </div>

            ${order.method === "QR" ? `
                
                <div class="invoice-row"> 
                    <span class="label">
                        <i class="tt fa-solid fa-building-columns"></i> 
                        <b>Ngân Hàng: 
                            <span class="text">${order.bank_name}</span>
                        </b>
                    </span> 
                </div>

                <div class="invoice-row"> 
                    <span class="label">
                        <i class="tt fa-solid fa-money-check"></i> 
                        <b>Số Tài Khoản: 
                            <span class="text">${order.bank_account}</span>
                        </b>
                    </span> 
                </div>
                
            ` : ""}

            <div class="invoice-row">
                <span class="label"><i class="tt fa-solid fa-clock"></i> <b>Thời Gian: <span class="text">${order.created_at.replace("T", " ").slice(0, 16)}</b></span></span>
            </div>

            <div class="produc">
                ${productList}
            </div>

            <div class="invoice-roww" style="margin-top: 10px;">
                <span class="label">Phí vận chuyển: 30.000 VNĐ</span>
            </div>
            
            <div class="total-row">
                <span class="tong"><i class="fa-solid fa-circle-dollar-to-slot"></i> TỔNG THANH TOÁN:</span>
                <span class="price">${order.total.toLocaleString('vi-VN')} VNĐ</span>
            </div>
    `;
} 