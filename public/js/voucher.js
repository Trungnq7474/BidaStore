const addVoucher = document.querySelector('.add-voucher');
const form = document.querySelector('.form-bg');
const add = document.querySelector('.add');
const icon = document.querySelector('.icon');

add.addEventListener('click', () => {
    form.style.display = "block";
});

icon.addEventListener('click', () => {
    form.style.display = "none";
});


addVoucher.addEventListener('click', async () => {
    const code = document.querySelector('.code').value;
    const type = document.querySelector('.type').value;
    const value = document.querySelector('.value').value;
    const min_order = document.querySelector('.min-order').value;
    const quantity = document.querySelector('.quantity').value;
    const start_date = document.querySelector('.start-date').value;
    const end_date = document.querySelector('.end-date').value;

    if(code === "" || type === "" || value === "" || min_order === "" || quantity === "" || start_date === "" || end_date === "") {
        show("Bạn Không Được Phép Để Trống !");
        return;
    }

    const res = await fetch('/add-voucher', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            code: code,
            type: type,
            value: value,
            min_order: min_order,
            quantity: quantity,
            start_date: start_date,
            end_date: end_date
        })
    });

    const data = await res.text();

    if(data === "ok") {
        show(`Thêm Mã Giảm Giá ${code} Thành Công !`);

        setTimeout(() => {
            location.reload();
        }, 2000);
    } 
    else if(data === "had") {
        show("Mã Giảm Giá Đã Tồn Tại !");
    }
    else {
        show("Thêm Mã Giảm Giá Thất Bại !");
    }
});

fetch('/getvouchers')
    .then(res => res.json())
    .then(data => {
        const voucherList = document.querySelector('.voucher-list');
        voucherList.innerHTML = "";

        data.forEach(async voucher => {

            const today = new Date().toISOString().slice(0, 16).replace("T", " ");
            const start = voucher.start_date.replace("T", " ").slice(0, 16);
            const end = voucher.end_date.replace("T", " ").slice(0, 16);

            const active = today >= start && today <= end;

            voucherList.innerHTML += `
            <tr data-id="${voucher.id}" data-filter="${active ? 'actioning' : 'due'} ${voucher.type === "percent" ? "percent" : "price"}">
                <td>VOU-00${voucher.id}</td>
                <td>${voucher.code}</td>
                <td>${voucher.type === "percent" ? "Giảm Phần Trăm" : "Giảm Tiền"}</td>
                <td>${voucher.type === "percent" ? voucher.value + "%" : voucher.value.toLocaleString("vi-VN") + " VNĐ"}</td>
                <td>${(voucher.min_order).toLocaleString("vi-VN")} VNĐ</td>
                <td>${voucher.quantity}</td>
                <td>${voucher.start_date.replace("T", " ").slice(0, 16)}</td>
                <td>${voucher.end_date.replace("T", " ").slice(0, 16)}</td>
                <td><span class="${active ? 'voucher-active' : 'voucher-inactive'}"> 
                ${active ? 'Đang Hoạt Động' : 'Đã Hết Hạn'}</span></td>
                <td>
                    <button class="edit" data-id="${voucher.id}"><i class="fa-solid fa-pen-to-square"></i> Sửa</button>
                    <button class="delete" data-id="${voucher.id}"><i class="fa-solid fa-trash-can"></i> Xóa</button>
                </td>
            </tr>
            `;

            await fetch('/updatevouchersstatus', {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({
                    id: voucher.id,
                    is_active: active ? 1 : 0
                }) 
            });
        });
    });

let edit = null;
let old = null;

document.addEventListener('click', async function(e) {
    if(e.target.closest('.edit')) {
        const button = e.target.closest('.edit');
        const id = button.dataset.id;

        edit = id;
        const res = await fetch('/getvouchers');
        const data = await res.json();
        const voucher = data.find(v => v.id == id); 

        old = {
            code: voucher.code,
            type: voucher.type,
            value: voucher.value,
            min_order: voucher.min_order,
            quantity: voucher.quantity,
            start_date: voucher.start_date.replace("T", " ").slice(0, 16),
            end_date: voucher.end_date.replace("T", " ").slice(0, 16)
        }

        const editForm = document.querySelector('.edit-bg');
        editForm.querySelector('.code').value = voucher.code;
        editForm.querySelector('.type').value = voucher.type;
        editForm.querySelector('.value').value = voucher.value;
        editForm.querySelector('.min-order').value = voucher.min_order;
        editForm.querySelector('.quantity').value = voucher.quantity;
        editForm.querySelector('.start-date').value = voucher.start_date.slice(0, 16);
        editForm.querySelector('.end-date').value = voucher.end_date.slice(0, 16);

        editForm.style.display = "block";
    }
});

document.querySelector('.econ').addEventListener('click', () => {
    document.querySelector('.edit-bg').style.display = "none";
});

document.querySelector('.edit-voucher').addEventListener('click', async () => {
    const editFormBg = document.querySelector('.edit-bg');

    const code = editFormBg.querySelector('.code').value;
    const type = editFormBg.querySelector('.type').value;
    const value = editFormBg.querySelector('.value').value;
    const min_order = editFormBg.querySelector('.min-order').value;
    const quantity = editFormBg.querySelector('.quantity').value;
    const start_date = editFormBg.querySelector('.start-date').value;
    const end_date = editFormBg.querySelector('.end-date').value;

    if(code === "" || type === "" || value === "" || min_order === "" || quantity === "" || start_date === "" || end_date === "") {
        show("Bạn Không Được Phép Để Trống !");
        return;
    }

    if(code === old.code && type === old.type && Number(value) === Number(old.value) && Number(min_order) === Number(old.min_order) && Number(quantity) === Number(old.quantity) && start_date.replace("T", " ").slice(0, 16) === old.start_date.replace("T", " ").slice(0, 16) && end_date.replace("T", " ").slice(0, 16) === old.end_date.replace("T", " ").slice(0, 16)) {
        show("Bạn Chưa Sửa Đổi !");
        return;
    }

    const res = await fetch('/updatevouchers', {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: edit,
            code: code,
            type: type,
            value: value,
            min_order: min_order,
            quantity: quantity,
            start_date: start_date,
            end_date: end_date
        })
    });

    const data = await res.text();

    if(data === "ok") {
        show(`Cập Nhật Mã Giảm Giá ${code} Thành Công !`);

        setTimeout(() => {
            location.reload();
        }, 2000);
    }

    else {
        show("Cập Nhật Mã Giảm Giá Lỗi !");
    }
});

document.addEventListener('click', function(e) {
    if(e.target.closest('.delete')) {
        now = e.target.closest('tr');
        const id = now.querySelector('.delete').dataset.id;
        const name = now.children[1].innerText;

        const box = document.querySelector('.confirm-box2');
        const yes = document.querySelector('.yes2');

        box.style.display = "block";

        yes.dataset.id = id;
        yes.dataset.code = name;
    }

    if(e.target.closest('.no2')) {
        document.querySelector('.confirm-box2').style.display = "none";
    }

    if(e.target.closest('.yes2')) {
        const yes = e.target.closest('.yes2');
        const id = yes.dataset.id;
        const name = yes.dataset.code;

        document.querySelector('.confirm-box2').style.display = "none";

        fetch('/deletevouchers', {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id,
                code: name,
            })
        })

        .then(res => res.text())
        .then(data => {
            if(data === "ok") {
                show(`Admin Đã Xóa Mã Giảm Giá ${name} Thành Công !`);

                setTimeout(() => {
                    now.remove();
                }, 2000);
            }
        })
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