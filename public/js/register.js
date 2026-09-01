const form = document.querySelector('.dk');

form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const username = form.username.value;
    const password = form.password.value;
    const email = form.email.value;
    const phone = form.phone.value;

    document.querySelector('.email-error').innerText = "";
    document.querySelector('.username-error').innerText = "";
    document.querySelector('.phone-error').innerText = "";
    document.querySelector('.password-error').innerText = "";

    let sai = false;

    if (email === "") {
        document.querySelector('.email-error').innerText =
            "Vui lòng nhập email !";

        sai = true;
    }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.querySelector('.email-error').innerText =
            "Email không hợp lệ !";

        sai = true;
    }


    if (username === "") {
        document.querySelector('.username-error').innerText =
            "Vui lòng nhập tên !";

        sai = true;
    }
    else if (!/^[\p{L}]+(?: [\p{L}]+)+$/u.test(username.trim())) {
        document.querySelector('.username-error').innerText = 
            "Vui lòng nhập đầy đủ họ và tên !";

        sai = true;
    }
    else if (username.trim().length < 3 || username.trim().length > 50) {
        document.querySelector('.username-error').innerText = 
            "Họ và tên phải từ 3-50 ký tự !";

        sai = true;
    }


    if (phone === "") {
        document.querySelector('.phone-error').innerText =
            "Vui lòng nhập số điện thoại !";

        sai = true;
    }
    else if (!/^0[0-9]{9}$/.test(phone)) {
        document.querySelector('.phone-error').innerText =
            "Số điện thoại phải có 10 số và bắt đầu bằng 0 !";

        sai = true;
    }


    if (password === "") {
        document.querySelector('.password-error').innerText =
            "Vui lòng nhập mật khẩu !";

        sai = true;
    }
    else if (!/^(?=.*[a-zA-Z])(?=.*[0-9]).{6,}$/.test(password)) {
        document.querySelector('.password-error').innerText =
            "Mật khẩu phải ít nhất 6 ký tự, gồm chữ và số !";

        sai = true;
    }

    if (sai) {
        return;
    }


    const res = await fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            username: username,
            password: password,
            email: email,
            phone: phone
        })
    });

    const data = await res.text();

    if(data === "sai") {
        show("Email Đăng Kí Của Bạn Đã Tồn Tại !");
        return;
    }

    else if (data === "ok") {
        show("Bạn Đã Đăng Ký Thành Công !");

        setTimeout(() => {
            window.location.href = "../login.html";
        }, 1000);
    }
});

const passwordInput = document.querySelector('.dkpass');
const eye = document.querySelector('.eye');


eye.style.display = "none";

passwordInput.addEventListener('input', () => {
    if(passwordInput.value.length > 0) {
        eye.style.display = "block";
    }

    else {
        eye.style.display = "none";
    }
});

eye.addEventListener('click', () => {
    if(passwordInput.type === "password"){
        passwordInput.type = "text";

        eye.classList.remove("fa-eye");
        eye.classList.add("fa-eye-slash");
    }

    else {
        passwordInput.type = "password";
        eye.classList.remove("fa-eye-slash");
        eye.classList.add("fa-eye");
    }
});

function show(text) {
    const mgs = document.querySelector('.mgs');

    mgs.innerText = text;
    mgs.style.display = "block";

    setTimeout(() => {
       mgs.style.display = "none"; 
    }, 1000);
}
