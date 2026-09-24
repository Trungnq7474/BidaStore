fetch('/getcontact')
    .then(res => res.json())
    .then(data => {
        const constactList = document.querySelector('.contact-list');
        constactList.innerHTML = "";

        data.forEach(contact => {
            constactList.innerHTML += `

                <tr data-id="${contact.id}" data-filter="${contact.is_read ? 'da' : 'chua'}">
                    <td class="id">FBK-00${contact.id}</td>
                    <td class="user">${contact.name}</td>
                    <td>
                        <a href="#" class="email-link">${contact.email}</a>
                    </td>
                    <td class="call">${contact.phone}</td>
                    <td class="des">${contact.mess}</td>
                    <td><span class="${contact.is_read ? 'done' : 'new'}"> ${contact.is_read ? 'Đã Đọc' : 'Chưa Đọc'}</span></td>
                    <td class="hour">${contact.created_at.replace("T", " ").slice(0, 16)}</td>
                    <td>
                        <button class="delete" data-id="${contact.id}"><i class="fa-solid fa-trash-can"></i> Xóa</button>
                    </td>
                </tr>
            `
        });
    })

document.addEventListener('click', async (e) => {
    if(e.target.closest('.email-link')) {
        e.preventDefault();

        const row = e.target.closest('tr');
        const id = row.dataset.id;
        const email = e.target.closest('.email-link').innerText;
        const isRead = row.dataset.filter === "da";

        const name = row.querySelector('.user').innerText;
        const message = row.querySelector('.des').innerText;

        const subject = "Phản Hồi Liên Hệ Từ BidaStore";

        const body = `Xin Chào ${name} ! 😊😊


        💙 𝗕𝗜𝗗𝗔 𝗦𝗧𝗢𝗥𝗘

        𝗖ả𝗺 Ơ𝗻 𝗕ạ𝗻 Đã 𝗟𝗶ê𝗻 𝗛ệ 𝗩ớ𝗶 𝗕𝗶𝗱𝗮𝗦𝘁𝗼𝗿𝗲 !
        📩 𝗡ộ𝗶 𝗗𝘂𝗻𝗴 𝗧𝗶𝗻 𝗡𝗵ắ𝗻 𝗖ủ𝗮 𝗕ạ𝗻:

        💌 ${message}

        Cảm Ơn Bạn Đã Liên Hệ Với BidaStore ! 💕 😊


        Trân Trọng,

        💙 BidaStore`;

        const gmailUrl = `https://mail.google.com/mail/u/1/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        window.open(gmailUrl, '_blank');

        if(!isRead) {
            await fetch('/readcontact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    id
                })
            });

            row.children[5].innerHTML = `
                <span class="done">Đã đọc</span>
            `;

            row.dataset.filter = "da";

            show("Đã Mở Gmail Để Trả Lời Liên Hệ !");
        }

    }
});

document.addEventListener('click', function(e){
    if(e.target.closest('.delete')) {
        now = e.target.closest('tr');
        const idd = e.target.closest('.delete').dataset.id;

        const box = document.querySelector('.confirm-box2');
        const yes = document.querySelector('.yes2');

        box.style.display = "block";

        yes.dataset.id = idd;
    }

    if(e.target.closest('.no2')) {
        document.querySelector('.confirm-box2').style.display = "none";
    }

    if(e.target.closest('.yes2')) {
        const yes = e.target.closest('.yes2');
        const id = yes.dataset.id;
        const name = yes.dataset.name; 

        document.querySelector('.confirm-box2').style.display = "none";

        fetch('/deletecontact', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    id: id
                })
            })
            
            .then(res => res.text())
            .then(data => {
                if(data === "ok"){
                    show(`Amin Đã Xóa Liên Hệ FBK-00${id} Thành Công !`);
                    setTimeout(() => {
                        now.remove();
                    }, 2000); 
                }
            })
        }
    });

const deleteAllBtn = document.querySelector('.delete-all');
const confirmAllBox = document.querySelector('.confirm-box-all');
const noAllBtn = document.querySelector('.no-all');
const yesAllBtn = document.querySelector('.yes-all');

deleteAllBtn.addEventListener('click', () => {
    const contactList = document.querySelector('.contact-list');

    if(contactList.querySelectorAll('tr').length === 0) {
        show('Không Có Liên Hệ Nào Để Xóa !');
        return;
    }
    confirmAllBox.style.display = "block";
});

noAllBtn.addEventListener('click', () => {
    confirmAllBox.style.display = 'none';
});

yesAllBtn.addEventListener('click', async () => {
    const res = await fetch('/deletecontactall', {
        method: "DELETE"
    });

    const data = await res.text();

    if(data === "ok") {
        confirmAllBox.style.display = 'none';

        document.querySelector('.contact-list').innerHTML = "";

        show('Admin Đã Xóa Tất Cả Liên Hệ Thành Công !');
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

