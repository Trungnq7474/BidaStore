document.querySelector('.send').addEventListener('click', async () => {

    const name = document.querySelector('.name').value;
    const email = document.querySelector('.email').value;
    const mess = document.querySelector('.mess').value;
    const phone = document.querySelector('.phone').value;

    const resUser = await fetch('/get-user');
    const dataUser = await resUser.json();

    if(!dataUser.user) {
        show("Bạn Vui Lòng Đăng Nhập Để Sử Dụng Chức Năng Này !");
        return;
    }

    if(name == "" || email == "" || mess == "" || phone === "")  {
        show("Bạn Không Được Phép Để Trống !");
        return;
    }

    const res = await fetch('/sendcontact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            name, 
            email, 
            mess,
            phone
        })
    });

    const data = await res.text();

    if(data =="ok") {
        show("Bạn Đã Gửi Liên Hệ Thành Công !");

        document.querySelector('.name').value = "";
        document.querySelector('.email').value = "";
        document.querySelector('.mess').value = "";
        document.querySelector('.phone').value = "";
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