fetch('header.html')
    .then(res => res.text())
    .then(async data => {

        document.querySelector('#header').innerHTML = data;

        document.querySelectorAll("nav a").forEach(function (link) {

            if (link.getAttribute("href") === "#") {
                return;
            }

            const url = new URL(link.href);

            if (
                url.pathname === location.pathname &&
                url.search === location.search
            ) {
                link.classList.add("active");
            }

        });

        const bell = document.querySelector('.bell');
        const bellCount = document.querySelector('.bell-count');
        const notificationsBox = document.querySelector('.notifications-box');

        bell.addEventListener('click', (e) => {

            e.preventDefault();

            if(notificationsBox.style.display === "block") {
                notificationsBox.style.display = "none";
                bell.classList.remove("active");
            }

            else {
                notificationsBox.style.display = "block";
                bell.classList.add("active");
            }

        });

        function getUsernoti() {
            fetch('/getusernoti')
                .then(res => res.json())
                .then(data => {
                    notificationsBox.innerHTML =``;

                    const unread = data.filter(item => 
                        item.is_read === 0 || item.is_read === false
                    );

                    if(unread.length > 0) {
                        bellCount.textContent = unread.length;
                        bellCount.style.display = "flex";
                    }

                    else {
                        bellCount.textContent = "";
                        bellCount.style.display = "none";
                    }

                  


                    if(data.length === 0) {
                        notificationsBox.innerHTML =`
                            <h3>Thông Báo</h3>
                            <div class="no-notifications"> 
                                Hiện Tại Không Có Thông Báo Nào ! 
                            </div>
                        `;
                        return;
                    }

                    notificationsBox.innerHTML =`
                        <h3>Thông Báo</h3>
                    `;

                    data.forEach(item => {
                        const isUnread = item.is_read === 0 || item.is_read === false;
                        notificationsBox.innerHTML +=`
                            <div class="notifications-item ${isUnread ? 'unread' : 'read'}" data-id="${item.id}" data-type="${item.type}" data-product="${item.product_id}">
                                <p>${item.message}.</p>
                                <span class="notifications-time">${item.created_at.replace("T", " ").slice(0, 16)}</span>
                            </div>
                        `;
                    });

                    notificationsBox.innerHTML += `
                        <div class="mark">
                            <i class="fa-solid fa-square-xmark"></i>
                        </div>
                    `;
                });
        }

        notificationsBox.addEventListener('click', (e) => {
            const item = e.target.closest(".notifications-item");

            if(!item) {
                return;
            }


            const id = item.dataset.id;
            const type = item.dataset.type;
            const product_id = item.dataset.product;


            fetch('/readusernoti', {
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

                let number = Number(bellCount.textContent);

                if(number > 0) {
                    bellCount.textContent = number - 1;
                }

                if(type === "order") {
                    window.location.href = "../donhang.html";
                }

                else if (type === "review") {
                    window.location.href =  `../spchitiet.html?product_id=${product_id}`;
                }

                else if (type === "contact") {
                    window.location.href = "../contact.html";
                }
            })
        });

        notificationsBox.addEventListener('click', (e) => {
            const mark = e.target.closest('.mark');

            if(mark) {
                fetch('/deleteusernoti', {
                    method: 'DELETE'
                })
                    .then(res => res.text())
                    .then(data => {
                        if(data === "ok") {
                            notificationsBox.innerHTML = `
                                <h3>Thông Báo</h3>

                                <div class="no-notifications">
                                    Hiện Tại Không Có Thông Báo Nào !
                                </div>
                            `;

                            show("Đã Xóa Tất Cả Các Thông Báo Thành Công !");
                            bellCount.textContent = ""; 
                            bellCount.style.display = "none";
                        }
                    });
                return;
            }
        });

        getUsernoti();
        setInterval(getUsernoti, 3000);


        async function updatecount() {
            const resUser = await fetch('/get-user');
            const dataUser = await resUser.json();

            const cartcount = document.querySelector('.cart-count');

            if(!dataUser.user){
                cartcount.style.display = "none";
                return;
            }

            const user_id = dataUser.user.id;

            const res = await fetch(`/get-cart?user_id=${user_id}`);
            const cart = await res.json();

            let total = 0;

            cart.forEach(item => {
                total += item.quantity;
            });

            if(total > 0) {
                cartcount.innerText = total;
                cartcount.style.display = "flex";
            }

            else {
                cartcount.style.display = "none";
            }
        }

        updatecount();

        const res = await fetch('/get-user');
        const dataa = await res.json();

        const dx = document.querySelector('.dx');

        if (!dx) {
            return;
        }

        if (dataa.user) {

            dx.style.display = "block";

            dx.addEventListener('click', async function() {

                const res = await fetch('/logout', {
                    method: 'POST'
                });

                const data = await res.json();

                if (data.success) {
                    show("Bạn Đã Đăng Xuất Thành Công !");
                    setTimeout(() => {
                        window.location.href = "../login.html";
                    }, 1000);
                    
                }

            });

        } else {

            dx.style.display = "none";

        }

    });

    document.addEventListener('click', async function(e) { 
        const cart = e.target.closest('.count'); 
        const delivery = e.target.closest('.delivery');
        const personal = e.target.closest('.personal');
    
        if(!cart && !delivery && !personal) { 
            return; 
        } 

        e.preventDefault();
    
        const res = await fetch('/get-user'); 
        const data = await res.json(); 
    
        if(!data.user) { 
            if(cart) {
                show("Bạn Vui Lòng Đăng Nhập Để Xem Giỏ Hàng !"); 
            }

            if(delivery) {
                show("Bạn Vui Lòng Đăng Nhập Để Xem Đơn Hàng !"); 
            }

            if(personal) {
                show("Bạn Vui Lòng Đăng Nhập Để Xem Thông Tin Cá Nhân !");
            }
            return; 
        }

        if(cart) {
            window.location.href = cart.href; 
        }

        if(delivery) {
            window.location.href = delivery.href; 
        }

        if(personal) {
            window.location.href = personal.href;
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










