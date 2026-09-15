window.onload = async function() {

    function getImageUrl(image) {
        if (!image) return "";

        if (image.startsWith("http://") || image.startsWith("https://")) {
            return image;
        }

        image = image.replace(/^\/+/, "");
        image = image.replace(/^images\//, "");

        return `/images/${image}`;
    }

    const order_id = new URLSearchParams(window.location.search).get("order_id");

    const res = await fetch(`/getorder/${order_id}`);
    const order = await res.json();
    const voucher = order.voucher;

    const resItems = await fetch(`/getorderitems/${order_id}`);
    const items = await resItems.json();

    const invoice = document.querySelector(".invoice-box");

    let productList = "";
    let productTotal = 0;
    let promotionTotal = 0;

    items.forEach(item => {
        if (item.discount > 0 && item.new_price) {
            productTotal += item.new_price * item.quantity;
            promotionTotal += (item.old_price - item.new_price) * item.quantity;
        } else {
            productTotal += item.price * item.quantity;
        }

        productList += `
            <div class="product-list">
                <div class="product-item">
                    <div class="product-info">
                        <img src="${getImageUrl(item.image)}" alt="Ảnh" class="product-img">
                        <div class="product-detail">
                            <h3 class="product-name">${item.product_name}</h3>
                            <h4 class="product-qty">Số lượng: x${item.quantity}</h4>
                        </div>
                    </div>
                    <span class="product-price">
                        ${item.discount > 0 && item.new_price
                            ? `<span class="price-old">${item.old_price.toLocaleString('vi-VN')} VNĐ</span>
                                <span class="price-new">${item.new_price.toLocaleString('vi-VN')} VNĐ</span>`
                            : `<span class="price-normal">${item.price.toLocaleString('vi-VN')} VNĐ</span>`
                        }
                    </span>
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
                        <b>Ngân Hàng (Shop): 
                            <span class="text">${order.bank_name}</span>
                        </b>
                    </span> 
                </div>

                <div class="invoice-row"> 
                    <span class="label">
                        <i class="tt fa-solid fa-money-check"></i> 
                        <b>Số Tài Khoản (Shop): 
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

            <div class="invoice-roww" style="margin-top: 15px;">
                <span class="label"><i class="fa-solid fa-money-check-dollar"></i>Phương Thức Giao Hàng:</span>
                <span class="text">
                    ${order.shipping === 30000 ? "Giao Hàng Tiêu Chuẩn" : order.shipping === 50000 ? "Giao Hàng Nhanh" : "Miễn Phí Giao Hàng"}
                </span>
            </div>

            <div class="invoice-roww" style="margin-top: 15px;">
                <span class="label"><i class="fa-solid fa-coins"></i>Tổng Đơn Hàng:</span>
                <span class="text">${productTotal.toLocaleString('vi-VN')} VNĐ</span>
            </div>

            ${promotionTotal > 0 ? `
                <div class="invoice-roww" style="margin-top: 15px;">
                    <span class="label">
                        <i class="fa-solid fa-tag"></i>Giá Khuyến Mãi:
                    </span>
                    <span class="text">
                        - ${promotionTotal.toLocaleString('vi-VN')} VNĐ
                    </span>
                </div>
            ` : ""}

            <div class="invoice-roww" style="margin-top: 15px;">
                <span class="label"><i class="fa-solid fa-money-bill-transfer"></i>Phí Vận Chuyển:</span>
                <span class="text">
                    ${order.shipping === 0 ? "Miễn Phí" : order.shipping.toLocaleString('vi-VN') + " VNĐ"}
                </span>
            </div>

           ${voucher ? ` 
                <div class="invoice-roww" style="margin-top: 15px;">
                    <span class="label">
                        <i class="fa-solid fa-ticket-simple"></i>
                        Voucher: ${voucher.code} 
                        (Giảm: ${voucher.type === "percent"
                            ? (productTotal * voucher.value / 100).toLocaleString('vi-VN')
                            : voucher.value.toLocaleString('vi-VN')} VNĐ)
                    </span>

                    <span class="text">
                        - ${voucher.type === "percent"
                            ? (productTotal * voucher.value / 100).toLocaleString('vi-VN')
                            : voucher.value.toLocaleString('vi-VN')} VNĐ
                    </span>
                </div> 
            ` : ""}
            
            <div class="total-row">
                <span class="tong"><i class="fa-solid fa-circle-dollar-to-slot"></i> TỔNG THANH TOÁN:</span>
                <span class="price">${order.total.toLocaleString('vi-VN')} VNĐ</span>
            </div>
    `;
} 