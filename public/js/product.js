fetch('/products')
    .then(res => res.json())
    .then(data => {
        const productList = document.querySelector('.product-list');
        productList.innerHTML = "";

        data.forEach(product => {
                productList.innerHTML += 
                `
                <tr>
                    <td>PRO-00${product.product_id}</td>
                    <td>
                        <img src="../images/${product.image}" alt="Ảnh">
                    </td>
                    <td>${product.product_name}</td>
                    <td>${product.price.toLocaleString("vi-VN")} VNĐ</td>
                    <td style="width: 277px">${product.description}</td>       
                    <td>
                        <button class="edit" data-id="${product.product_id}"><i class="fa-solid fa-pen-to-square"></i> Sửa</button>
                        <button class="delete" data-id="${product.product_id}"><i class="fa-solid fa-trash-can"></i> Xóa</button>
                    </td>
                </tr>
                `;
        }); 
});

const form = document.querySelector('.form-bg');
const add = document.querySelector('.add');
const icon = document.querySelector('.icon');

add.addEventListener('click', () => {
    form.style.display = "block";
});

icon.addEventListener('click', () => {
    form.style.display = "none";
});

document.querySelector('.save').addEventListener('click', async () => {
    const inname = document.querySelector('.inname').value;
    const inprice = document.querySelector('.inprice').value;
    const indescrip = document.querySelector('.indescrip').value;
    const inimg = document.querySelector('.inimg').files[0];
    const incate = document.querySelector('.incate').value;

    if(inname === "" || inprice === "" || !inimg || indescrip === "" || incate === "") {
        show("Bạn Không Được Phép Để Trống !");
        return;
    }

    const formData = new FormData();

    formData.append("inname", inname);
    formData.append("indescrip", indescrip);
    formData.append("inprice", inprice);
    formData.append("image", inimg);
    formData.append("incate", incate);


    const res = await fetch('/addpro', {
        method: 'POST',
        body: formData
    });

    const data = await res.text();
    if(data === "ok") {
        show(`Bạn Đã Thêm Sản Phẩm ${inname} Thành Công !`);
        
        setTimeout(() => {
            location.reload();
        }, 2000);
    }

    else {
        show("Thêm Sản Phẩm Lỗi !");
    }
});

let edit = null;
let old = null;

document.addEventListener('click', async function(e) {
    if(e.target.closest('.edit')) {
        const button = e.target.closest('.edit');
        const id = button.dataset.id;

        edit = id;

        const res = await fetch(`/product/${id}`);
        const product = await res.json();

        old = {
            product_name: product.product_name,
            price: product.price,
            category: product.category,
            description: product.description,
            image: product.image
        }

        document.querySelector('.edname').value = product.product_name;
        document.querySelector('.edprice').value = product.price;
        document.querySelector('.edcate').value = product.category;
        document.querySelector('.eddescrip').value = product.description;

        document.querySelector('.edit-bg').style.display = "block";
    }
});

document.querySelector('.update').addEventListener('click', async () => {

    const name = document.querySelector('.edname').value;
    const price = document.querySelector('.edprice').value;
    const category = document.querySelector('.edcate').value;
    const description= document.querySelector('.eddescrip').value;
    const image = document.querySelector('.edimg').files[0];

    if(name === "" || price === "" || category === "" || description === "") {
        show("Bạn Không Được Phép Để Trống !");
        return;
    }

    if(name === old.product_name && Number(price) === Number(old.price) && category === old.category && description === old.description && !image) {
        show("Bạn Chưa Sửa Đổi !");
        return;
    }

    const formData = new FormData();
    
    formData.append("id", edit);
    formData.append("name", name);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("description", description);

    if(image) {
        formData.append("image",image);
    }

    const res = await fetch('/updatepro', {
        method: 'PUT',
        body: formData
    });

    const data = await res.text();

    if(data === "ok") {
        show(`Bạn Đã Cập Nhật Sản Phẩm ${name} Thành Công !`);
        
        setTimeout(() => {
            location.reload();
        }, 2000);
    }

    else {
        show("Cập Nhật Sản Phẩm Lỗi !")
    }

});

document.querySelector('.econ').addEventListener('click', () =>{
    document.querySelector('.edit-bg').style.display = "none";
})

document.addEventListener('click', function(e) {
    if(e.target.closest('.delete')) {
        now = e.target.closest('tr');
        const id = now.querySelector('.delete').dataset.id;
        const name = now.children[2].innerText;

        const box = document.querySelector('.confirm-box2');
        const yes = document.querySelector('.yes2');

        box.style.display = "block";

        yes.dataset.id = id;
        yes.dataset.name = name;
    }

    if(e.target.closest('.no2')) {
        document.querySelector('.confirm-box2').style.display = "none";
    }

    if(e.target.closest('.yes2')) {
        const yes = e.target.closest('.yes2');
        const id = yes.dataset.id;
        const name = yes.dataset.name;

        document.querySelector('.confirm-box2').style.display = "none";

        fetch('/deletepro', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    id:id,
                    name: name
                })
            })

            .then(res => res.text())
            .then(data => {
                if(data === "ok") {
                    show(`Bạn Đã Xóa Sản Phẩm ${name} Thành Công !`);

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


