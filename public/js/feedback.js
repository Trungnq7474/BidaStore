fetch('/getcontact')
    .then(res => res.json())
    .then(data => {
        const constactList = document.querySelector('.contact-list');
        constactList.innerHTML = "";

        data.forEach(contact => {
            constactList.innerHTML += `

                <tr data-id="${contact.id}" data-filter="${contact.is_read ? 'da' : 'chua'}">
                    <td>FBK-00${contact.id}</td>
                    <td>${contact.name}</td>
                    <td>
                        <a href="http://mail.google.com/mail/?view=cm&fs=1&to=${contact.email}" target="_blank" class="email-link">${contact.email}</a>
                    </td>
                    <td>${contact.phone}</td>
                    <td><b>${contact.mess}</b></td>
                    <td><span class="${contact.is_read ? 'done' : 'new'}"> ${contact.is_read ? 'Đã Đọc' : 'Chưa Đọc'}</span></td>
                    <td>${contact.created_at.replace("T", " ").slice(0, 16)}</td>
                    <td>
                        <button class="delete" data-id="${contact.id}"><i class="fa-solid fa-trash-can"></i> Xóa</button>
                    </td>
                </tr>
            `
        });
    })

document.addEventListener('click', async (e) => {
    if(e.target.closest('.email-link')) {
        const row = e.target.closest('tr');
        const id = row.dataset.id;

        await fetch('/readcontact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                id
            })
        })

        row.children[5].innerHTML = `
            <span class="done">Đã đọc</span>
        `;

        row.dataset.filter = "da";
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

    
function show (text) {
    const mgs2 = document.querySelector('.mgs2');

    mgs2.innerText = text;
    mgs2.style.display = "block";

    setTimeout(() => {
        mgs2.style.display = "none";
    }, 2000);
}

