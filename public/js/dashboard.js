function getImageUrl(image) {
    if (!image) return "";

    if (image.startsWith("http://") || image.startsWith("https://")) {
        return image;
    }

    image = image.replace(/^\/+/, "");
    image = image.replace(/^images\//, "");

    return `/images/${image}`;
}


fetch('/getreve')
    .then(res => res.json())
    .then(data => {
        const dt = Array(12).fill(0);

        data.forEach(item => {
            dt[item.thang -1] = item.doanhthu;
        });

        const myChart = document.querySelector('.myChart');

        new Chart(myChart, {
            type: 'bar',

            data: {
                labels: [
                    'Tháng 1',
                    'Tháng 2',
                    'Tháng 3',  
                    'Tháng 4',
                    'Tháng 5',
                    'Tháng 6',
                    'Tháng 7',
                    'Tháng 8',
                    'Tháng 9',
                    'Tháng 10',
                    'Tháng 11',
                    'Tháng 12',
                ],

                datasets: [{
                    label:'Doanh Thu',
                    data: dt,
                    backgroundColor: 'rgb(196, 0, 206)',
                }]
            },

            options: {
                scales: {
                    x: {
                        ticks: {
                            font: {
                                weight: 'bold',
                                size: 15
                            }, 
                        }
                    },
                    y: {
                        ticks: {
                            font: {
                                weight: 'bold',
                                size: 15
                            },

                            callback: function(value) {
                                return value.toLocaleString('vi-VN') + ' VNĐ';   
                            }
                        }
                    }
                }
            }
        });
    });


fetch('/getordermonth')
    .then(res => res.json())
    .then(data => {

        const sd = Array(12).fill(0);

        data.forEach(item => {
            sd[item.thang - 1] = item.sodon;
        });

        const myChart2 = document.querySelector('.myChart2');

        new Chart(myChart2, {
            type: 'pie',

            data: {
                labels: [
                    'Tháng 1',
                    'Tháng 2',
                    'Tháng 3',  
                    'Tháng 4',
                    'Tháng 5',
                    'Tháng 6',
                    'Tháng 7',
                    'Tháng 8',
                    'Tháng 9',
                    'Tháng 10',
                    'Tháng 11',
                    'Tháng 12',
                ],

                datasets: [{
                    label: 'Đơn Hàng',
                    data: sd
                }]
            },

            options: {
                plugins: {
                    legend: {
                        labels: {
                            font: {
                                weight: 'bold',
                                size: 15
                            }
                        }
                    }
                }
            }
        });
    });


fetch('/getproductcount')
    .then(res => res.json())
    .then(data => {
        document.querySelector('.product-count').innerText = data.total;
    });

fetch('/getordercount')
    .then(res => res.json())
    .then(data => {
        document.querySelector('.order-count').innerText = data.total;
    });

fetch('/getcommentcount')
    .then(res => res.json())
    .then(data => {
        document.querySelector('.review-count').innerText = data.total;
    });

fetch('/getcontactcount')
    .then(res => res.json())
    .then(data => {
        document.querySelector('.contact-count').innerText = data.total;
    });

const toplist = document.querySelector('.top-list');

fetch('/gettopproduct')
    .then(res => res.json())
    .then(data => {
        toplist.innerHTML = "";

        data.forEach((item, index) => {
            toplist.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>
                        <img src="${getImageUrl(item.image)}" alt="Ảnh">
                    </td>
                    <td class="namee">${item.product_name}</td>
                    <td>${item.da_ban}</td>
                    <td class="totall">${item.doanh_thu.toLocaleString('vi-VN')} VNĐ</td>
                </tr>
            `
        });
    });

    