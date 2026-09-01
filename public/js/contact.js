async function getUser() {

    const resUser = await fetch('/get-user');
    const dataUser = await resUser.json();

    if (!dataUser.user) {
        return;
    }

    document.querySelector('.name').value = dataUser.user.username;
    document.querySelector('.email').value = dataUser.user.email;
    document.querySelector('.phone').value = dataUser.user.phone;
}

getUser();

document.querySelector('.send').addEventListener('click', async () => {

    const resUser = await fetch('/get-user');
    const dataUser = await resUser.json();
  
    if(!dataUser.user) {
        show("Bạn Vui Lòng Đăng Nhập Để Sử Dụng Chức Năng Này !");
        return;
    }

    const name = document.querySelector('.name').value.trim();
    const email = document.querySelector('.email').value.trim();
    const phone = document.querySelector('.phone').value.trim();
    const mess = document.querySelector('.mess').value.trim();

    if (!name || !email || !mess || !phone) {
        show("Bạn Không Được Phép Để Trống !");
        return;
    }

    const res = await fetch('/sendcontact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            name: name, 
            email: email, 
            mess: mess,
            phone: phone
        })
    });

    const data = await res.text();

    if(data =="ok") {
        show("Bạn Đã Gửi Liên Hệ Thành Công !");

        document.querySelector('.mess').value = "";
       
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