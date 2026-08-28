function load(file, id) {
    fetch(file)
        .then(res => res.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;
        });
}

load('slidebar.html', 'slide');

const bell = document.querySelector(".bell");
const notification = document.querySelector(".notification-box");
const count = document.querySelector(".notification-count");


bell.addEventListener('click', () => {

    if(notification.style.display === "block") {
        bell.classList.remove("active");
        notification.style.display = "none";
    }

    else {
        bell.classList.add("active");
        notification.style.display = "block";
    }
});

function getNofi() {
    fetch('/getnoti')
        .then(res => res.json())
        .then(data => {
            notification.innerHTML = "";

            const unread = data.filter(item => 
                item.is_read === false || item.is_read === 0
            );

            if(unread.length > 0) {
                count.textContent = unread.length;
                count.style.display = "flex";
            }

            else {
                count.style.display = "none";
            }

            if(data.length === 0) {
                notification.innerHTML =`
                    <h3>Thông Báo</h3>
                    <p class="no-notification">Hiện Tại Không Có Thông Báo Nào !</p>
                `;

                return;
            }

            notification.innerHTML =`
                    <h3>Thông Báo</h3>
                `;

            data.forEach(item => {
                notification.innerHTML +=`
                    <div class="notification-item ${item.is_read ? "read" : "unread"}" data-id="${item.id}" data-type="${item.type}">
                        <p>${item.message}</p>
                        <span class="notification-time">${item.created_at.replace("T", " ").slice(0, 16)}</span>
                    </div>
                `;
            });

            notification.innerHTML += `
                <div class="markxx">
                    <i class="fa-solid fa-square-xmark"></i>
                </div>
            `;
        });
}



notification.addEventListener('click', (e) => {

    const mark = e.target.closest(".markxx");

    if(mark) {

        fetch('/deleteadminnoti', {
            method: "DELETE"
        })

        .then(res => res.text())
        .then(data => {

            if(data === "ok") {

                notification.innerHTML = `
                    <h3>Thông Báo</h3>

                    <p class="no-notification">
                        Hiện Tại Không Có Thông Báo Nào !
                    </p>
                `;
                show("Admin Đã Xóa Tất Cả Các Thông Báo Thành Công !");

                count.textContent = "";
                count.style.display = "none";
            }

        });

        return;
    }

    const item = e.target.closest(".notification-item");

    if(!item) {
        return;
    }

    const id = item.dataset.id;
    const type = item.dataset.type;
    
    fetch('/readnoti', {
        method: "PUT",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify({
            id: id
        })
    })

    .then(() => {
        item.classList.remove("unread");
        item.classList.add("read");

        let number = Number(count.textContent);

        if(number > 0) {
            count.textContent = number - 1;
        }
        
        if(type === "order") {
            window.location.href = "../admin/order.html";
        }

        else if(type === "review") {
            window.location.href = "../admin/review.html";
        }

        else if(type === "contact") {
            window.location.href = "../admin/feedback.html";
        }

        else if(type === "user") {
            window.location.href = "../admin/user.html";
        }
    });
});

getNofi();
setInterval(getNofi, 3000);

fetch('/get-admin')
    .then(res => res.json())
    .then(admin => {
        const im = document.querySelector('.im');
        const n = admin.username.trim().split(" ");
        const avatar = (n.shift()[0] + n.pop()[0]).toUpperCase();

        im.textContent = avatar;
    });

function show (text) {
    const mgs2 = document.querySelector('.mgs2');

    mgs2.innerText = text;
    mgs2.style.display = "block";

    setTimeout(() => {
        mgs2.style.display = "none";
    }, 2000);
}

