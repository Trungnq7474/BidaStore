const form = document.querySelector('.dn');
const emailError = document.querySelector('.email-error');
const passError = document.querySelector('.password-error');

form.addEventListener('submit', async function(e) {
    
    e.preventDefault();

    const email = form.email.value.trim();
    const pass = form.password.value.trim();

    emailError.innerText = "";
    passError.innerText = "";

    if (email === "") {
        emailError.innerText = "Vui lòng nhập email !";
        return;
    }

    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        emailError.innerText = "Email không hợp lệ !";
        return;
    }

    if (pass === "") {
        passError.innerText = "Vui lòng nhập mật khẩu !";
        return;
    }

    else if (!/^(?=.*[a-zA-Z])(?=.*[0-9]).{6,}$/.test(pass)) {
        passError.innerText = "Mật khẩu phải ít nhất 6 ký tự, gồm chữ và số !";
        return;
    }

    const res = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            email: email,
            password: pass,
        })
    });

    const data = await res.text();

    if(data === "admin") {
        show("Admin Đã Đăng Nhập Thành Công !");

        setTimeout(() => {
             window.location.href = "../admin/dashboard.html";
        }, 1000);
       
    }

    else if (data === "customer") {
        show("Bạn Đã Đăng Nhập Khách Hàng Thành Công !");

        setTimeout(() => {
            window.location.href = "../index.html";
        }, 1000);
        
    }

    else {
        show("Email Hoặc Mật Khẩu Của Bạn Không Đúng !");
    }
});

const passwordInput = document.querySelector('.dnpass');
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
