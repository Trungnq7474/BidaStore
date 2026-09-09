const tongquan = document.querySelector('.tongquan');
const tt = document.querySelector('.tt'); 
const dmk = document.querySelector('.dmk'); 
const diachi = document.querySelector('.diachi');

const tq = document.querySelector('.tq');
const cn = document.querySelector('.cn'); 
const mk = document.querySelector('.mk'); 
const dc = document.querySelector('.dc');

cn.addEventListener('click', () => {
    tongquan.style.display = "none";
    tt.style.display = "block";
    dmk.style.display = "none";
    diachi.style.display = "none";

    cn.classList.add("active");
    tq.classList.remove("active");
    mk.classList.remove("active");
    dc.classList.remove("active");
});

mk.addEventListener('click', () => {
    tongquan.style.display = "none";
    tt.style.display = "none";
    dmk.style.display = "block";
    diachi.style.display = "none";

    mk.classList.add("active");
    tq.classList.remove("active");
    cn.classList.remove("active");
    dc.classList.remove("active");
})

dc.addEventListener('click', () => {
    tongquan.style.display = "none";
    tt.style.display = "none";
    dmk.style.display = "none";
    diachi.style.display = "block";

    dc.classList.add("active");
    tq.classList.remove("active");
    cn.classList.remove("active");
    mk.classList.remove("active");
});

tq.addEventListener('click', () => {
    tongquan.style.display = "block";
    tt.style.display = "none";
    dmk.style.display = "none";
    diachi.style.display = "none";

    tq.classList.add("active");
    cn.classList.remove("active");
    mk.classList.remove("active");
    dc.classList.remove("active");
});

let oldname;
let oldemail;
let oldphone;

async function getuser() {
    const res = await fetch('/get-user');
    const data = await res.json();

    document.querySelector('.name').innerText = data.user.username;
    document.querySelector('.email').innerText = data.user.email;
    document.querySelector('.phone').innerText = data.user.phone;

    oldname = data.user.username;
    oldemail = data.user.email;
    oldphone = data.user.phone;

    const n = data.user.username.trim().split(" ");
    document.querySelector('.picture').innerText = (n.shift()[0] + n.pop()[0]).toUpperCase();
}

getuser();

document.querySelector('.edit-name').addEventListener('click', () => {
    document.querySelector('.name').contentEditable = true;
});

document.querySelector('.edit-email').addEventListener('click', () => {
    document.querySelector('.email').contentEditable = true;
});

document.querySelector('.edit-phone').addEventListener('click', () => {
    document.querySelector('.phone').contentEditable = true;
});

document.querySelector('.save').addEventListener('click', async () => {
    const username = document.querySelector('.name').innerText.trim();
    const email = document.querySelector('.email').innerText.trim();
    const phone = document.querySelector('.phone').innerText.trim();

    if(username === oldname && email === oldemail && phone === oldphone) {
        show("Bạn Chưa Chỉnh Sửa !");
        return;
    }

    if(username === "" || email === "" || phone === "") {
        show("Bạn Không Được Phép Để Trống !");
        return;
    }

    const res = await fetch('/updateuser', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            username: username,
            email: email,
            phone: phone
        })
    });

    const data = await res.text();

    if(data === "ok") {
        show("Bạn Đã Cập Nhật Thành Công !");

        document.querySelector('.name').contentEditable = false;
        document.querySelector('.email').contentEditable = false;
        document.querySelector('.phone').contentEditable = false;
    }
    else {
        show("Cập Nhật Thất Bại !");
    }
});


document.querySelector('.update').addEventListener('click', async () =>{
    const oldPass = document.querySelector('.oldpass').value;
    const newPass = document.querySelector('.newpass').value;

    if(oldPass === "" || newPass === "") {
        show("Bạn Không Được Phép Để Trống !");
        return;
    }

    const res = await fetch('/updatepass', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            oldPass: oldPass,
            newPass: newPass
        })
    });

    const data = await res.text();

    if(data === "ok") {
        show("Đã Đổi Mật Khẩu Thành Công !");

        document.querySelector('.oldpass').value = "";
        document.querySelector('.newpass').value = "";

    }

    else {
        show("Mật Khẩu Hiện Tại Của Bạn Không Đúng !");
    }
});

const oldpass = document.querySelector('.oldpass');
const newpass = document.querySelector('.newpass');

const eyeOld = document.querySelector('.eye-old');
const eyeNew = document.querySelector('.eye-new');

eyeOld.style.display = "none";
eyeNew.style.display = "none";

oldpass.addEventListener('input', () => {
    if(oldpass.value.length > 0) {
        eyeOld.style.display = "block";
    }

    else {
        eyeOld.style.display = "none";
    }
});

newpass.addEventListener('input', () => {
    if(newpass.value.length > 0) {
        eyeNew.style.display = "block";
    }

    else {
        eyeNew.style.display = "none";
    }
});

eyeOld.addEventListener('click', () => {
    if(oldpass.type === "password") {
        oldpass.type = "text";

        eyeOld.classList.remove("fa-eye");
        eyeOld.classList.add("fa-eye-slash");
    }

    else {
        oldpass.type = "password";

        eyeOld.classList.remove("fa-eye-slash");
        eyeOld.classList.add("fa-eye");
    }
});

eyeNew.addEventListener('click', () => {
    if(newpass.type === "password") {
        newpass.type = "text";

        eyeNew.classList.remove("fa-eye");
        eyeNew.classList.add("fa-eye-slash");
    }

    else {
        newpass.type = "password";

        eyeNew.classList.remove("fa-eye-slash");
        eyeNew.classList.add("fa-eye");
    }
});

const showAddressForm = document.querySelector('.show-address-form'); 
const addressFormBox = document.querySelector('.address-form-box'); 
const cancelAddress = document.querySelector('.cancel-address'); 
const addressOverlay = document.querySelector('.address-overlay'); 


showAddressForm.addEventListener('click', () => { 
    addressFormBox.style.display = "block"; 
    addressOverlay.style.display = "block"; 
    showAddressForm.style.display = "none"; 
}); 
 
cancelAddress.addEventListener('click', () => { 
    addressFormBox.style.display = "none"; 
    addressOverlay.style.display = "none"; 
    showAddressForm.style.display = "block"; 

    editId = null;
    oldAddress = [];

    document.querySelector('.address-form-box h3').innerText = "Thêm Địa Chỉ Mới";

    document.querySelector('.add-address').innerHTML = `
        <i class="fa-solid fa-floppy-disk"></i> Lưu Địa Chỉ
    `;
});

const city = document.querySelector('.address-city');
const ward = document.querySelector('.address-ward');

let editId = null;
let oldAddress = [];

fetch('https://34tinhthanh.com/api/provinces')
    .then(res => res.json())
    .then(data => {
        data.forEach(item => {
            city.innerHTML +=`
                <option value="${item.province_code}" data-name="${item.name}">
                    ${item.name}
                </option>
            `;
        });
    });

    city.addEventListener('change', () => {
        ward.innerHTML =`
            <option value="">-- Chọn Xã / Phường / Đặc Khu --</option>
        `;

        if(city.value === "") {
            return;
        }

        fetch(`https://34tinhthanh.com/api/wards?province_code=${city.value}`)
            .then(res => res.json())
            .then(data => {
                data.forEach(item => {
                    ward.innerHTML +=`
                        <option value="${item.ward_name}">
                            ${item.ward_name}
                        </option>
                    `
                });
            });
    });

document.querySelector('.add-address').addEventListener('click', async () => {
    const name = document.querySelector('.address-name').value.trim();
    const phone = document.querySelector('.address-phone').value.trim();
    const address_detail = document.querySelector('.address-detail').value.trim();
    const city = document.querySelector('.address-city');
    const ward = document.querySelector('.address-ward');

    const cityName = city.querySelector('option:checked').dataset.name;

    if(name === "" || phone === "" || address_detail === "" || city.value === "" || ward.value === "") {
        show("Bạn Không Được Phép Để Trống !");
        return;
    }

    const is_default = document.querySelector('.default-address input').checked;

    const newAddress = [
        name,
        phone,
        address_detail,
        cityName,
        ward.value,
        is_default
    ];

    if(editId && JSON.stringify(oldAddress) === JSON.stringify(newAddress)) {
        show("Bạn Chưa Chỉnh Sửa !");
        return;
    }

    if(editId) {
        const res = await fetch(`/updateaddress/${editId}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                phone: phone,
                address_detail: address_detail,
                city: cityName,
                ward: ward.value,
                is_default: is_default
            })
        });

        const data = await res.text();

        if(data === "default") {
            show("Bạn Chỉ Được Phép Có 1 Địa Chỉ Mặc Định !");
            return;
        }

        if(data === "ok") {
            show("Bạn Đã Cập Nhật Địa Chỉ Thành Công !");

            editId = null;
            oldAddress = [];

            document.querySelector('.address-name').value = "";
            document.querySelector('.address-phone').value = "";
            document.querySelector('.address-detail').value = "";

            city.value = "";
            ward.value = "";

            document.querySelector('.default-address input').checked = false;

            document.querySelector('.address-form-box h3').innerText = "Thêm Địa Chỉ Mới";

            document.querySelector('.add-address').innerHTML = `
                <i class="fa-solid fa-floppy-disk"></i> Lưu Địa Chỉ
            `;

            addressFormBox.style.display = "none";
            addressOverlay.style.display = "none";
            showAddressForm.style.display = "block";

            getAddress();
        }

        else {
            show("Cập Nhật Địa Chỉ Thất Bại !");
        }

        return;
    }

    const res = await fetch('/addaddress', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            phone: phone,
            address_detail: address_detail,
            city: cityName,
            ward: ward.value,
            is_default: is_default
            
        })
    });

    const data = await res.text();

    if(data === "default") {
        show("Bạn Chỉ Được Phép Có 1 Địa Chỉ Mặc Định !");
        return;
    }

    if(data === "full") {
        show("Bạn Chỉ Được Thêm Tối Đa 3 Địa Chỉ !");
        return;
    }

    if(data === "ok") {
        show("Bạn Thêm Địa Chỉ Thành Công !");

        document.querySelector('.address-name').value = "";
        document.querySelector('.address-phone').value = "";
        document.querySelector('.address-detail').value = "";

        city.value = "";
        ward.value = "";

        document.querySelector('.default-address input').checked = false;

        addressFormBox.style.display = "none";
        addressOverlay.style.display = "none";
        showAddressForm.style.display = "block";

        getAddress();
    }

    else {
        show("Thêm Địa Chỉ Thất Bại !");
    }
});

async function getAddress() {
    const res = await fetch('/getaddress');
    const data = await res.json();

    const list = document.querySelector('.address-list');
    list.innerHTML = "";
    
    data.forEach(item => {
            list.innerHTML +=`
                <div class="address-item">
                    <div class="address-content">
                        <div class="address-top">
                            <strong>${item.name}</strong>
                            ${item.is_default ? `<span class="default-tag">Mặc Định</span>` : "" }
                        </div>

                        <p>${item.phone}</p>
                        <p>${item.address_detail}, ${item.ward}, ${item.city}</p>
                    </div>

                    <div class="address-action">
                        <button class="edit-address" data-id="${item.address_id}"><i class="fa-solid fa-pen"></i> Sửa</button>
                        <button class="delete-address" data-id="${item.address_id}"><i class="fa-solid fa-trash"></i> Xóa</button>
                    </div>
                </div>
            `;
        });
    };
getAddress();

async function editAddress(id) {
    editId = id;

    const res = await fetch(`/getoneaddress/${id}`);
    const data = await res.json();

    oldAddress = [
        data.name,
        data.phone,
        data.address_detail,
        data.city,
        data.ward,
        Boolean(data.is_default)
    ];

    document.querySelector('.address-name').value = data.name;
    document.querySelector('.address-phone').value = data.phone;
    document.querySelector('.address-detail').value = data.address_detail;
   
    city.value = "";
    city.querySelectorAll("option").forEach(item => {
        if(item.dataset.name === data.city) {
            city.value = item.value;
        }
    });

    const resWard = await fetch(`https://34tinhthanh.com/api/wards?province_code=${city.value}`);
    const dataWard = await resWard.json();

    ward.innerHTML = `
        <option value="">-- Chọn Xã / Phường / Đặc Khu --</option>
    `;

    dataWard.forEach(item => {
        ward.innerHTML += `
            <option value="${item.ward_name}">
                ${item.ward_name}
            </option>
        `;
    });

    ward.value = data.ward;
    document.querySelector('.default-address input').checked = Boolean(data.is_default);

    document.querySelector('.address-form-box h3').innerText = "Sửa Địa Chỉ";

    document.querySelector('.add-address').innerHTML = `
        <i class="fa-solid fa-pen"></i> Cập Nhật
    `;

    addressFormBox.style.display = "block";
    addressOverlay.style.display = "block";
    showAddressForm.style.display = "none";
}

document.addEventListener('click', (e) => {
    const btn = e.target.closest('.edit-address');
    if(btn) {
        const id = btn.dataset.id;
        editAddress(id);
    }
});

document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.delete-address');

    if(btn) {
        const id = btn.dataset.id;
        const res = await fetch(`/deleteaddress/${id}`, {
            method: "DELETE"
        });

        const data = await res.text();

        if(data === "ok") {
            show("Bạn Đã Xóa Địa Chỉ Thành Công !");
            getAddress();
        }

        else {
            show("Xóa Địa Chỉ Thất Bại !");
        }
    }
});

async function getMyProductCount() {
    const res = await fetch('/getmyproductcount');
    const data = await res.json();

    document.querySelector('.total-product').textContent = data.total || 0;
}

getMyProductCount();

async function getMyMoney() {
    const res = await fetch('/getmymoney');
    const data = await res.json();

    document.querySelector('.total-money').textContent = Number(data.total || 0).toLocaleString('vi-VN') + " VNĐ";
}

getMyMoney();

async function getMyOrder() {
    const res = await fetch('/getmyordercount');
    const data = await res.json();

    document.querySelector('.total-order').textContent = data.total || 0;
}

getMyOrder();

async function getMyComplete() {
    const res = await fetch('/getmycomplete');
    const data = await res.json();

    document.querySelector('.total-complete').textContent = data.total || 0;
}

getMyComplete();


function show(text) {
    const mgs = document.querySelector('.mgs');

    mgs.innerText = text;
    mgs.style.display = "block";

    setTimeout(() => {
       mgs.style.display = "none"; 
    }, 2000);
}
