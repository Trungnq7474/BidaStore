const input = document.querySelector('.input-box input');
const send = document.querySelector('.send-btn');
const mess = document.querySelector('.messages');
const emojiBtn = document.querySelector(".emoji-btn");
const emojiPicker = document.querySelector(".emoji-picker");
const fileBtn = document.querySelector('.file-btn');
const fileInput = document.querySelector('.file-input');
const chatBody = document.querySelector('.chat-body');
const filePreview = document.querySelector('.file-preview');
const imageModal = document.querySelector('.image-modal');
const modalImage = document.querySelector('.modal-image');
const closeImage = document.querySelector('.close-image');


emojiBtn.addEventListener('click', () => {
    emojiPicker.classList.toggle("show");
});

emojiPicker.addEventListener('emoji-click', (e) => {
    input.value += e.detail.unicode;
    input.focus();
});

fileBtn.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', () => {
    const files = fileInput.files;

    filePreview.innerHTML = "";

    for(let i=0; i <files.length; i++ ) {

        const file = files[i];

        if(file.type.startsWith("image/")) {

            const img = document.createElement("img");
            img.src = URL.createObjectURL(file);
            filePreview.appendChild(img);
        }

        else {
            const div = document.createElement("div");
            
            div.classList.add("file-item");

            div.innerHTML =`
                <i class="fa-solid fa-file"></i>
                <span>${file.name}</span>
            `;

            filePreview.appendChild(div);
        }
        
    }
});

async function getMessage() {
    const resUser = await fetch('/get-user');
    const dataUser = await resUser.json();

    const user_id = dataUser.user.id;

    const resAdmin = await fetch('/get-admin');
    const dataAdmin = await resAdmin.json();

    const n = dataAdmin.username.trim().split(" ");
    const adminAvatar = (n.shift()[0] + n.pop()[0]).toUpperCase();

    document.querySelector('.shop-avatar').textContent = adminAvatar;

    await fetch(`/readmess/${user_id}`, {
        method: "PUT"
    });

    const res = await fetch(`/getmess/${user_id}`);
    const data = await res.json();

    mess.innerHTML = "";

    let dayold = "";

    data.forEach(item => {
        const day = new Date(item.created_at).toLocaleDateString('vi-VN');

        if(day !== dayold) {
            mess.innerHTML +=`
                <div class="date"><span>${day}</span></div>
            `;
            dayold = day;
        }

        let filesHTML = "";

        if(item.file_path) {
            const files = item.file_path.split("|");
            files.forEach(path => {
                const fileName = path.split("/").pop();

                const extension = fileName.split(".").pop().toLowerCase();

                if(extension === "jpg" ||
                    extension === "jpeg" ||
                    extension === "png" ||
                    extension === "gif" ||
                    extension === "webp") {
                        filesHTML +=`
                            <img class="chat-image" src="/${path}" onclick="showImage('/${path}')">
                        `;
                    }

                else {
                    filesHTML +=`
                        <div class="chat-file">

                            <i class="fa-solid fa-file"></i>

                            <span>${fileName}</span>

                        </div>
                    `;
                }
            });
        }

        if(item.sender === "user") {
            mess.innerHTML +=`
                <div class="message user-message">
                    <div class="message-content">
                        ${filesHTML}
                        <div class="message-bubble">${item.message}</div>
                        <span class="message-time">${item.created_at.slice(11,16)}</span>
                    </div>
                </div>
            `;
        }

        else {
            let time = "";

            if(item.message !== "SHOP BIDA Xin chào bạn!" && item.message !== "Bạn cần chúng tôi hỗ trợ điều gì ạ?") {
                time = `<span class="message-time">${item.created_at.slice(11,16)}</span>`;
            }

            mess.innerHTML +=`
                <div class="message shop-message">
                    <div class="message-avatar">${adminAvatar}</div>
                    <div class="message-content">

                        ${filesHTML}
                        
                        <div class="message-bubble">${item.message}</div>
                        ${time}
                    </div>
                </div>
            `;
        }
    });
    chatBody.scrollTop = chatBody.scrollHeight;
}

send.addEventListener('click', async function() {
    const message = input.value;

    const files = fileInput.files;

    if(message === "") {
        show("Bạn Vui Lòng Nhập Tin Nhắn !");
        return;
    }

    const resUser = await fetch("/get-user");
    const dataUser = await resUser.json();

    const user_id = dataUser.user.id;

    const formData = new FormData();

    formData.append("user_id",user_id);
    formData.append("sender", "user");
    formData.append("message", message);

    for(let i =0; i< files.length; i++){
        formData.append("files", files[i]);
    }

    await fetch('/sendmess', {
        method: "POST",
        body: formData
    });

    input.value = "";
    fileInput.value = "";

    filePreview.innerHTML = "";
    getMessage();
});

input.addEventListener('keydown', async function(e){
    if(e.key === "Enter") {
        send.click();
    }
});

getMessage();

function show(text) {
    const mgs = document.querySelector('.mgs');

    mgs.innerText = text;
    mgs.style.display = "block";

    setTimeout(() => {
       mgs.style.display = "none"; 
    }, 2000);
}

function showImage(src) {

    modalImage.src = src;

    imageModal.classList.add("show");
}

closeImage.addEventListener('click', () => {

    imageModal.classList.remove("show");

});