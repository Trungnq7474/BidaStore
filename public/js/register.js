const form = document.querySelector('.dk');
const emailError = document.querySelector('.email-error');
const passError = document.querySelector('.password-error');
const usernameError = document.querySelector('.username-error');
const phoneError = document.querySelector('.phone-error');

form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const username = form.username.value.trim();
    const password = form.password.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();

    emailError.innerText = "";
    usernameError.innerText = "";
    phoneError.innerText = "";
    passError.innerText = "";

    if (email === "") {
        emailError.innerText = "Vui lòng nhập email !";
        return;
    }

    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        emailError.innerText = "Email không hợp lệ !";
        return;
    }

    if (username === "") {
        usernameError.innerText = "Vui lòng nhập tên !";
        return;
    }

    else if (!/^[\p{L}]+(?: [\p{L}]+)+$/u.test(username.trim())) {
        usernameError.innerText =  "Vui lòng nhập đầy đủ họ và tên !";
        return;
    }

    else if (username.trim().length < 3 || username.trim().length > 50) {
        usernameError.innerText =  "Họ và tên phải từ 3-50 ký tự !";
        return;
    }

    if (phone === "") {
        phoneError.innerText = "Vui lòng nhập số điện thoại !";
        return;
    }
    
    else if (!/^0[0-9]{9}$/.test(phone)) {
        phoneError.innerText = "Số điện thoại phải có 10 số và bắt đầu bằng 0 !";
        return;
    }

    if (password === "") {
        passError.innerText = "Vui lòng nhập mật khẩu !";
        return;
    }

    else if (!/^(?=.*[a-zA-Z])(?=.*[0-9]).{6,}$/.test(password)) {
        passError.innerText = "Mật khẩu phải ít nhất 6 ký tự, gồm chữ và số !";
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

const params = new URLSearchParams(window.location.search);

if (params.get('googleLogin') === 'success') {
    show("Bạn Đã Đăng Nhập Thành Công !");

    setTimeout(() => {
        window.location.href = "/";
    }, 2000);
}

function show(text) {
    const mgs = document.querySelector('.mgs');

    mgs.innerText = text;
    mgs.style.display = "block";

    setTimeout(() => {
       mgs.style.display = "none"; 
    }, 1000);
}
