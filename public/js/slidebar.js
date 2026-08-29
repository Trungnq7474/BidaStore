setTimeout(function() {

    const menu = document.querySelectorAll(".sidebar ul li a");

    menu.forEach(function(link) {

        if(link.pathname === window.location.pathname) {
            link.classList.add("active");
        }

    });

}, 100);


fetch('slidebar.html')
    .then(res => res.text())
    .then(data => {
        document.querySelector('#slide').innerHTML = data;

        function checkMess() {

            fetch('/getadminread')
                .then(res => res.json())
                .then(total => {
                    const count = document.querySelector('.mess-count');

                    if(total > 0) {
                        count.textContent = total;
                        count.style.display = "flex";
                    }

                    else {
                        count.style.display = "none";
                    }
                });
            }

            checkMess();
            setInterval(checkMess, 5000);


        const logout = document.querySelector('.logout button');

        logout.addEventListener('click', async function() {

            const res = await fetch('/logout', {
                method: 'POST'
            });

            const data = await res.json();

            if(data.success) {
                show("Admin Đã Đăng Xuất Thành Công !");

                setTimeout(() => {
                    window.location.href = "../login.html";
                }, 2000);
                
            }
        });

        const sidebar = document.querySelector('.sidebar');
        const toggleBtn = document.querySelector('.toggle-btn');

        toggleBtn.addEventListener('click', function() {

            sidebar.classList.toggle('collapsed');

        });
    });

    function show(text) {
        const mgs2 = document.querySelector('.mgs2');

        mgs2.innerText = text;
        mgs2.style.display = "block";

        setTimeout(() => {
            mgs2.style.display = "none";
        }, 2000);
    }


