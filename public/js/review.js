fetch('/getallComment')
    .then(res => res.json())
    .then(data => {
        const commentList = document.querySelector('.comment-list');
        commentList.innerHTML = "";

        data.forEach(comment => {
            commentList.innerHTML += 
            `
                <tr data-filter="${comment.shop_reply ? 'da' : 'chua'} ${['','mot','hai','ba','bon','nam'][comment.rating]}">
                        <td class="id">REV-00${comment.id}</td>
                        <td class="user">${comment.user_name}</td>
                        <td class="spp">${comment.product_name}</td>
                        <td class="stars">
                            ${'<i class="fa-solid fa-star"></i> ' .repeat(comment.rating)} 
                        </td>
                        <td class="des comment-text">${comment.comment_text}</td>
                        <td class="hour">${comment.created_at.replace("T", " ").slice(0, 16)}</td>
                        <td class="des">${comment.shop_reply || "Chưa Phản Hồi"}</td>
                        <td>
                            <span class="${comment.shop_reply ? "status-done" : "status-new"}">${comment.shop_reply ? "Đã Phản Hồi" : "Chưa Phản Hồi"}</span>
                        </td>
                        <td>
                            <button class="reply" data-id="${comment.id}"><i class="fa-solid fa-reply"></i> Phản Hồi</button>
                            <button class="edit" data-id="${comment.id}"><i class="fa-solid fa-pen-to-square"></i> Sửa</button>
                            <button class="delete" data-id="${comment.id}"><i class="fa-solid fa-trash-can"></i> Xóa</button>
                        </td>
                    </tr>
            `;
        });
    });

let current = null;
let editCurrent = null;
let oldReply = '';

async function replyComment() {

    const id = current.querySelector('.reply').dataset.id;
    const reply = document.querySelector('.shop-reply').value;

    if(reply === "") {
        show("Admin Không Được Phép Để Trống !");
        return;
    }

    const res = await fetch('/replycomment', {
       method: 'POST',
       headers: {
            'Content-Type': 'application/json'
       },
       
       body: JSON.stringify({
            id,
            shop_reply: reply
       })
    });

    

    const data = await res.text();
    if(data === "ok") {
        show(`Admin Đã Phản Hồi Cho Bình Luận REV-00${id} Thành Công !`);
    }
    setTimeout(() => {
        location.reload();
    }, 2000);
    
}

async function updateComment() {
    if(!editCurrent) {
        return;
    }

    const id = editCurrent.querySelector('.edit').dataset.id;
    const shop_reply = document.querySelector('.edit-comment-text').value;

    if(shop_reply.trim() === oldReply.trim()) {
        show(`Admin Chưa Chỉnh Sửa !`);
        return;
    }

    const res = await fetch('/updatecomment', {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id,
            shop_reply: shop_reply
        })
    });

    const data = await res.text();

    if (data === "ok") {
        show(`Admin Đã Cập Nhật Phản Hồi Cho Bình Luận REV-00${id} Thành Công !`);

        setTimeout(() => {
            location.reload();
        }, 2000);
    }

    else if (data === "not") {
        show(`Admin Không Được Phép Để Trống !`);
    }

    else {
        show(`Cập Nhật Phản Hổi Thất Bại !`);
    }
}

document.addEventListener('click', function(e){
    if(e.target.closest('.reply')) {
        current = e.target.closest('tr');

        const shopreply = current.children[6].innerText;

        if(shopreply !== "Chưa Phản Hồi") {
            show("Bình Luận Này Đã Được Phản Hồi !");
            return;
        }
        
        const reply = current.children[4].innerText;
        document.querySelector('.user-comment').innerText = reply;
        document.querySelector('.modal').style.display = "block";
    }

    if(e.target.closest('.edit')) {
        editCurrent = e.target.closest('tr');

        oldReply = editCurrent.children[6].innerText === "Chưa Phản Hồi" ? "" :editCurrent.children[6].innerText;

        const comment = editCurrent.querySelector('.comment-text').innerText;
        const reply = editCurrent.children[6].innerText;

        
    document.querySelector('.edit-comment-user').innerText = comment;
    document.querySelector('.edit-comment-text').value = reply === "Chưa Phản Hồi" ? "" : reply;

    document.querySelector('.edit-modal').style.display = "flex";
    }

    if(e.target.closest('.close-edit')) {
        document.querySelector('.edit-modal').style.display = "none";
    }

    if(e.target.closest('.close-modal')) {
        document.querySelector('.modal').style.display = "none";
    }

    if(e.target.closest('.save-edit')) {
        updateComment();
    }

    if(e.target.closest('.send-reply')) {
        replyComment();
    }

    if(e.target.closest('.delete')) {
        now = e.target.closest('tr');
        const idd = now.querySelector('.delete').dataset.id;

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
        const idd = yes.dataset.id;

        document.querySelector('.confirm-box2').style.display = "none";

        fetch('/deletecomment', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    id: idd
                })
            })

            .then(res => res.text())
            .then(data => {
                if(data === "ok") {
                    show(`Admin Đã Xóa Đánh Giá & Bình Luận REV-00${idd} Thành Công !`);
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