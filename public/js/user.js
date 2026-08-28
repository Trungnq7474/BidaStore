fetch('/users')
    .then(res => res.json())
    .then(data => {
        const userList = document.querySelector('.user-list');
        userList.innerHTML = "";


        data.forEach(user => {

            const n = user.username.trim().split(" ");
            const picture = (n.shift()[0] + n.pop()[0]).toUpperCase();
            
             userList.innerHTML +=
            `
                <tr data-filter="${user.role}">
                    <td>USR-00${user.id}</td>
                    <td><div class="name"><div class="picture">${picture}</div> ${user.username}</div></td>
                    <td><a href="http://mail.google.com/mail/?view=cm&fs=1&to=${user.email}" class="email-link" target="_blank">${user.email}</a></td>
                    <td>${user.phone}</td>
                    <td><b>${user.role}</b></td>
                    <td>${user.created_at.replace("T", " ").slice(0, 16)}</td>
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
        const name = now.children[1].innerText;

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


    
function show (text) {
    const mgs2 = document.querySelector('.mgs2');

    mgs2.innerText = text;
    mgs2.style.display = "block";

    setTimeout(() => {
        mgs2.style.display = "none";
    }, 2000);
}