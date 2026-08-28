const form = document.querySelector('.dn');

form.addEventListener('submit', async function(e) {
    
    e.preventDefault();

    const email = form.email.value;
    const pass = form.password.value;

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

    if (pass === "") {
        document.querySelector('.password-error').innerText =
            "Vui lòng nhập mật khẩu !";

        sai = true;
    }
    else if (!/^(?=.*[a-zA-Z])(?=.*[0-9]).{6,}$/.test(pass)) {
        document.querySelector('.password-error').innerText =
            "Mật khẩu phải ít nhất 6 ký tự, gồm chữ và số !";

        sai = true;
    }

    if (sai) {
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
        show("Bạn Đã Đăng Nhập Admin Thành Công !");

        setTimeout(() => {
             window.location.href = "../admin/dashboard.html";
        }, 1000);
       
    }

    else if (data === "customer") {
        show("Bạn Đã Đăng Nhập Thành Công !");

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
