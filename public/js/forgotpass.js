const form = document.querySelector('#formOTP');
const otpForm = document.querySelector('#otp-form');
const otpInputs = document.querySelectorAll('.otp-input');
const verifyBtn = document.querySelector('#verifyotp');
const sendBtn = form.querySelector('.btnn');
const emailIcon = form.querySelector('.fa-envelope');
const emailError = document.querySelector('.email-error');
const forgot = document.querySelector('.forgot');
const fg = document.querySelector('.fg');
const back = document.querySelector('.back');

let emailOTP = "";
let otpSeconds = 120;
let otpTimer;

function startOTP() {
    clearInterval(otpTimer);
    otpSeconds = 120;

    const timer = document.querySelector('#otp-timer');

    otpTimer = setInterval(function() {
        let minutes = Math.floor(otpSeconds / 60);
        let seconds = otpSeconds % 60;

        timer.innerText = `Mã OTP Còn Hiệu Lực: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        if(otpSeconds <= 0) {
            clearInterval(otpTimer);
            timer.innerText = "Mã OTP Đã Hết Hiệu Lực !";
            return;
        }

        otpSeconds--;
    }, 1000);
}

form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = form.email.value.trim();

    emailError.innerText = "";

    if (email === "") {
        emailError.innerText = "Vui lòng nhập email !";
        return;
    }

    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        emailError.innerText = "Email không hợp lệ !";
        return;
    }

    const res = await fetch('/sendotp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email
        })
    });

    const data = await res.text();

    if(data === "ok") {

        emailOTP = email;

        show("Mã OTP Đã Được Gửi Về Email !");

        form.email.style.display = "none";
        emailIcon.style.display = "none";
        emailError.style.display = "none";
        forgot.style.display = "none";
        back.style.display = "none";
        sendBtn.style.display = "none";
        fg.style.display = "none";
        setTimeout(() => {
           otpForm.style.display = "grid"; 
        }, 300);
        otpInputs[0].focus();
        startOTP();
    }

    else if(data === "sai") {
        show("Email Không Tồn Tại !");
    }

    else {
        show("Lỗi Gửi OTP");
    }
});

otpInputs.forEach(function(input, index) {
    input.addEventListener('input', () => {
        input.value = input.value.replace(/\D/g, '').slice(0, 1);

        if(input.value !== "" && index < 5) {
            otpInputs[index + 1].focus();
        }
    });

    input.addEventListener('keydown', function(e) {
        if(e.key === "Backspace" && input.value === "" && index > 0) {
            otpInputs[index - 1].focus();
        }
    });
});

verifyBtn.addEventListener('click', async function() {
   let otp = "";
   
   otpInputs.forEach(function(input) {
        otp += input.value;
   });

   if(otp.length !== 6) {
        show("Vui Lòng Nhập Đủ 6 Số OTP !");
        return;
   }

   const res = await fetch('/verifyotp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: emailOTP,
            otp: otp
        })
   });

   const data = await res.text();

   if(data === "ok") {
        show("Xác Minh Mã OTP Thành Công !");

        otpForm.style.display = "none";
        setTimeout(() => {
            document.querySelector('#reset-form').style.display = "grid";
        }, 300);
   }

    else if (data === "fault") {
        show("Mã OTP Không Chính Xác !");
    }

    else if (data === "expired") {
        show("Mã OTP Đã Hết Hạn !");
    }

    else {
        show("Bạn Chưa Gửi Mã OTP !");
    }
});

const newPass = document.querySelector('#newPass');
const confirmPass = document.querySelector('#confirmPass');
const resetBtn = document.querySelector('#resetpass');

const newPassError = document.querySelector('.newpass-error');
const confirmPassError = document.querySelector('.confirmpass-error');
const eye = document.querySelector('.eye');
const eyes = document.querySelector('.eyes');

eye.style.display = "none";
eyes.style.display = "none";

newPass.addEventListener('input', () => {
    if(newPass.value.length > 0) {
        eye.style.display = "block";
    }

    else {
        eye.style.display = "none";
    }
});

confirmPass.addEventListener('input', () => {
    if(confirmPass.value.length > 0) {
        eyes.style.display = "block";
    }

    else {
        eyes.style.display = "none";
    }
});

eye.addEventListener('click', () => {
    if(newPass.type === "password") {
        newPass.type = "text";

        eye.classList.remove("fa-eye");
        eye.classList.add("fa-eye-slash");
    }

    else {
        newPass.type = "password";
        eye.classList.add("fa-eye");
        eye.classList.remove("fa-eye-slash");
    }
});

eyes.addEventListener('click', () => {
    if(confirmPass.type === "password") {
        confirmPass.type = "text";

        eyes.classList.remove("fa-eye");
        eyes.classList.add("fa-eye-slash");
    }

    else {
        confirmPass.type = "password";
        eyes.classList.add("fa-eye");
        eyes.classList.remove("fa-eye-slash");
    }
});

resetBtn.addEventListener('click', async function() {
    const pass = newPass.value.trim();
    const confirm = confirmPass.value.trim();

    newPassError.innerText = "";
    confirmPassError.innerText = "";

    if(pass === "") {
        newPassError.innerText = "Vui lòng nhập mật khẩu mới !";
        return;
    }

    if(!/^(?=.*[a-zA-Z])(?=.*[0-9]).{6,}$/.test(pass)) {
        newPassError.innerText = "Mật khẩu phải ít nhất 6 ký tự, gồm chữ và số !";
        return;
    }

    if (confirm === "") {
        confirmPassError.innerText = "Vui lòng nhập lại mật khẩu !";
        return;
    }

    if (pass !== confirm) {
        confirmPassError.innerText = "Mật khẩu nhập lại không khớp !";
        return;
    }

    const res = await fetch('/resetpass', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: emailOTP,
            newPass : pass
        })
    });

    const data = await res.text();

    if(data === "ok") {
        show("Đổi Mật Khẩu Thành Công !");

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1000);
    }

    else if(data === "not_verified") {
        show("Bạn Chưa Xác Minh Mã OTP !");
    }

    else if(data === "expired") {
        show("Mã OTP Đã Hết Hạn !");
    }

    else {
        show("Lỗi Đổi Mật Khẩu !");
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