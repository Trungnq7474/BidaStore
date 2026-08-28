const customers = document.querySelector('.customers');
const search = document.querySelector('.search-box input');
const chatBody = document.querySelector('.admin-chat-body');
const chatName = document.querySelector('.admin-chat-header h3');

const imageModal = document.querySelector('.image-modal');
const modalImage = document.querySelector('.modal-image');
const closeImage = document.querySelector('.close-image');

const input = document.querySelector('.admin-message-input');
const emojiBtn = document.querySelector('.admin-emoji-btn');
const emojiPicker = document.querySelector('.admin-emoji-picker');
const send = document.querySelector('.send');

const fileBtn = document.querySelector('.admin-file-btn');
const fileInput = document.querySelector('.admin-file-input');
const filePreview = document.querySelector('.admin-file-preview');

search.addEventListener('input', () => {
    const key = search.value.toLowerCase().trim();

    const customerList = document.querySelectorAll('.customer');

    customerList.forEach(customer => {
        const name = customer.querySelector('.customer-info h4').textContent.toLowerCase();

        if(name.includes(key)) {
            customer.style.display = "flex";
        }

        else {
            customer.style.display = "none";
        }
    });
});


emojiBtn.addEventListener('click', () => {
    emojiPicker.classList.toggle('show');
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

    for(let i=0; i< files.length; i++) {
        const file = files[i];

        if(file.type.startsWith("image/")) {
            const img = document.createElement("img");

            img.src = URL.createObjectURL(file);

            filePreview.appendChild(img);
        }

        else {
            const div = document.createElement("div");

            div.classList.add("admin-file-item");

            div.innerHTML =`
                <i class="fa-solid fa-file"></i>
                <span>${file.name}</span>
            `;

            filePreview.appendChild(div);
        }
    }
});

let user_id = null;
let avatar = "";

function getMessages() {

    fetch(`/getmess/${user_id}`)
        .then(res => res.json())
        .then(data => {

            chatBody.innerHTML = "";

            let dayold = "";

            data.forEach(item => {

                const day = new Date(item.created_at)
                    .toLocaleDateString('vi-VN');

                if(day !== dayold) {

                    chatBody.innerHTML += `
                        <div class="date">
                            <span>${day}</span>
                        </div>
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
                                    <img class="admin-chat-image" src="/${path}" onclick="showImage('/${path}')">
                                `;
                            }

                        else {
                            filesHTML+=`
                                <div class="admin-chat-file">

                                    <i class="fa-solid fa-file"></i>

                                    <span>${fileName}</span>

                                </div>
                            `
                        }
                    });
                }

                if(item.sender === "user") {

                    chatBody.innerHTML += `
                        <div class="admin-message customer-mess">

                            <div class="user-avatar">${avatar}</div>

                            <div class="message-content">

                                ${filesHTML}

                                <p>${item.message}</p>
                                <span>${item.created_at.slice(11, 16)}</span>
                            </div>

                        </div>
                    `;

                } else {

                    chatBody.innerHTML += `
                        <div class="admin-message shop-mess">

                            ${filesHTML}

                            <p>${item.message}</p>
                            <span>${item.created_at.slice(11, 16)}</span>
                        </div>
                    `;
                }

            });

            chatBody.scrollTop = chatBody.scrollHeight;

        });
}

fetch('/getusermess')
    .then(res => res.json())
    .then(data => {

        customers.innerHTML = "";

        data.forEach(user => {

            const n = user.username.trim().split(" ");
            const avatar = (n.shift()[0] + n.pop()[0]).toUpperCase();

            customers.innerHTML += `
                <div class="customer ${user.new_count > 0 ? "unread" : ""}" data-id="${user.id}">

                    <div class="customer-avatar">${avatar}</div>

                    <div class="customer-info">
                        <h4>${user.username}</h4>
                        <p>${user.message}</p>
                    </div>

                    <span class="new-count">
                        ${user.new_count > 0 ? user.new_count : ""}
                    </span>     

                    <span class="time">
                        ${user.created_at.slice(11, 16)}
                    </span>

                </div>
            `;
        });

        document.querySelectorAll('.new-count').forEach(count => {
            if(count.textContent.trim() !== "") {
                count.style.display = "flex";
            }
        });

        document.querySelectorAll('.customer').forEach(customer => {

            customer.addEventListener('click', () => {

                document.querySelectorAll('.customer').forEach(item => {
                    item.classList.remove("active");
                });

                customer.classList.add("active");
                customer.classList.remove("unread");

                user_id = customer.dataset.id;

                chatName.textContent =
                    customer.querySelector('h4').textContent;
                    avatar = customer.querySelector('.customer-avatar').textContent;
                    document.querySelector('.admin-chat-header .customer-avatar').textContent = avatar;


                fetch(`/readmessadmin/${user_id}`, {
                    method: "PUT"
                })
                    .then(res => res.text())
                    .then(data => {
                        const count = customer.querySelector('.new-count');

                            if(count) {
                                count.textContent = "";
                                count.style.display = "none";
                            }

                    });

                getMessages();

            });

        });

    });

send.addEventListener('click', async function() {

    const message = input.value;
    const files = fileInput.files;

    if(message === "") {
        show("Bạn Vui Lòng Nhập Tin Nhắn !");
        return;
    }

    if(user_id === null) {
        show("Bạn Chưa Chọn Khách Hàng !");
        return;
    }

    const formData = new FormData();

    formData.append("user_id", user_id);
    formData.append("sender", "shop");
    formData.append("message", message);

    for(let i =0; i< files.length; i++) {
        formData.append("files", files[i]);
    }

    await fetch('/sendmess', {
        method: 'POST',
        body: formData
    });

    input.value = "";
    fileInput.value = "";
    filePreview.innerHTML = "";

    getMessages();

});

input.addEventListener('keydown', function(e) {

    if(e.key === "Enter") {
        send.click();
    }

});

function show(text) {
    const mgs2 = document.querySelector('.mgs2');

    mgs2.innerText = text;
    mgs2.style.display = "block";

    setTimeout(() => {
       mgs2.style.display = "none"; 
    }, 2000);
}

function showImage(src) {

    modalImage.src = src;

    imageModal.classList.add("show");
}

closeImage.addEventListener('click', () => {

    imageModal.classList.remove("show");

});