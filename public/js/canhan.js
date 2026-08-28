const tt = document.querySelector('.tt');
const dmk =  document.querySelector('.dmk');
const cn = document.querySelector('.cn');
const mk = document.querySelector('.mk');

cn.addEventListener('click', () => {
    tt.style.display = "block";
    dmk.style.display ="none";
    cn.classList.add("active");
    mk.classList.remove("active");
});

mk.addEventListener('click', () => {
    tt.style.display = "none";
    dmk.style.display ="block";
    mk.classList.add("active");
    cn.classList.remove("active");
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


function show(text) {
    const mgs = document.querySelector('.mgs');

    mgs.innerText = text;
    mgs.style.display = "block";

    setTimeout(() => {
       mgs.style.display = "none"; 
    }, 2000);
}
