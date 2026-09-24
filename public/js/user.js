fetch('/users')
    .then(res => res.json())
    .then(data => {
        const userList = document.querySelector('.user-list');
        userList.innerHTML = "";


        data.forEach(user => {

            const n = user.username.trim().split(" ");
            const picture = (n.shift()[0] + n.pop()[0]).toUpperCase();

            const rank = user.membership_rank || "Không Có";

            const rankInfo = {
                "HẠNG ĐỒNG": {
                    className: "rank-bronze",
                    icon: '<i class="fa-solid fa-ribbon"></i>'
                },
                "HẠNG BẠC": {
                    className: "rank-silver",
                    icon: '<i class="fa-solid fa-award"></i>'
                },
                "HẠNG VÀNG": {
                    className: "rank-gold",
                    icon: '<i class="fa-solid fa-medal"></i>'
                },
                "HẠNG KIM CƯƠNG": {
                    className: "rank-diamond",
                    icon: '<i class="fa-solid fa-gem"></i>'
                },
                "HẠNG VIP": {
                    className: "rank-vip",
                    icon: '<i class="fa-solid fa-crown"></i>'
                }
            };

            const rankClass = rankInfo[rank] ? rankInfo[rank].className : "";
            const rankIcon = rankInfo[rank] ? rankInfo[rank].icon : "";

            userList.innerHTML +=
            `
                <tr data-filter="${user.role} ${rankClass}" data-rank="${rankClass || 'none'}">
                    <td class="id">USR-00${user.id}</td>
                    <td><div class="name"><div class="picture">${picture}</div> <span class="user">${user.username}</span></td>
                    <td><a href="http://mail.google.com/mail/?view=cm&fs=1&to=${user.email}" class="email-link" target="_blank">${user.email}</a></td>
                    <td class="call">${user.phone}</td>
                    <td>
                        <span class="user-rank ${rankClass}">
                            ${rankIcon} ${rank}
                        </span>
                    </td>
                    <td class="${user.role === "admin" ? "role-admin" : "role-user"}">
                        ${user.role}
                    </td>
                    <td class="hour">${user.created_at.replace("T", " ").slice(0, 16)}</td>
                    <td><button class="delete" data-id="${user.id}"><i class="fa-solid fa-trash-can"></i> Xóa</button>
                    </td>
                </tr>
            `;
        });
});

document.addEventListener('click', function(e){
    if(e.target.closest('.delete')) {
        now = e.target.closest('tr');
        const id = now.querySelector('.delete').dataset.id;
        const name = now.querySelector('.user').innerText;

        const box = document.querySelector('.confirm-box2');
        const yes = document.querySelector('.yes2');

        box.style.display = "block";

        yes.dataset.id = id;
        yes.dataset.username = name;
    }

    if(e.target.closest('.no2')) {
        document.querySelector('.confirm-box2').style.display = "none";
    }

    if(e.target.closest('.yes2')) {
        const yes = e.target.closest('.yes2');
        const id = yes.dataset.id;
        const name = yes.dataset.username;

        document.querySelector('.confirm-box2').style.display = "none";

        fetch('/deleteuser', {
                method: 'DELETE', 
                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    id: id,
                    username: name
                })
            })

            .then(res => res.text())
            .then(data => {
                if(data == "ok") {
                    show(`Admin Đã Xóa Người Dùng ${name} Thành Công !`);
                    setTimeout(() => {
                        now.remove();
                    }, 2000);
                }
            });
        }
    });

    const deleteAllBtn = document.querySelector('.delete-all');
    const confirmAllBox = document.querySelector('.confirm-box-all');
    const noAllBtn = document.querySelector('.no-all');
    const yesAllBtn = document.querySelector('.yes-all');

    deleteAllBtn.addEventListener('click', () => {
        const userList = document.querySelector('.user-list');

        if(userList.querySelectorAll('tr').length === 0) {
            show('Không Có Người Dùng Nào Để Xóa !');
            return;
        }
        confirmAllBox.style.display = "block";
    });

    noAllBtn.addEventListener('click', () => {
        confirmAllBox.style.display = 'none';
    });

    yesAllBtn.addEventListener('click', async () => {
        const res = await fetch('/deletealluser', {
            method: "DELETE"
        });

        const data = await res.text();

        if(data === "ok") {
            confirmAllBox.style.display = 'none';

            document.querySelector('.comment-list').innerHTML = "";

            show('Admin Đã Xóa Tất Cả Người Dùng Thành Công !');
        }
    });

    
function show (text) {
    const mgs2 = document.querySelector('.mgs2');

    mgs2.innerText = text;
    mgs2.style.display = "block";

    setTimeout(() => {
        mgs2.style.display = "none";
    }, 2000);
}