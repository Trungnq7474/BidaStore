const express = require('express'); //tạo server + API//
const session = require('express-session'); //dùng để: lưu trạng thái đăng nhập (ai đang login)//
const app = express(); // tạo website
const { connectDB, sql } = require('./config/db');
connectDB();

app.use(session({
    secret: 'abc123',//key mã hóa session
    resave: false,//không lưu lại nếu không thay đổi
    saveUninitialized: true //cho phép tạo session mới
}));
// => bật chức năng ghi nhớ người dùng


app.use(express.json()); //đọc dữ liệu JSON từ frontend
app.use(express.urlencoded({extended: true})); //đọc dữ liệu từ form HTML



const { checkAdmin, checkLogin } = require('./middleware/auth'); // Lấy hàm checkAdmin từ file middleware/auth.js

app.use('/admin', checkAdmin, express.static('public/admin'));

app.get(['/cart.html', '/canhan.html', '/chat.html', '/donhang.html', '/pay.html'], checkLogin, (req, res) => {
    res.sendFile(__dirname + '/public' + req.path);
});

// Khi người dùng truy cập đường dẫn bắt đầu bằng /admin
// thì chạy checkAdmin trước để kiểm tra người đó có phải admin không
// Nếu được phép thì mới cho truy cập các file trong thư mục public/admin

app.use(express.static('public'));// Cho phép người dùng truy cập các file bình thường bên trong thư mục public


// Gọi router

const authrouters = require('./routes/authroutes');
app.use('/', authrouters);

const cartrouters = require('./routes/cartrouters');
app.use('/', cartrouters);

const productrouters = require('./routes/productrouters');
app.use('/', productrouters);

const commentrouters = require('./routes/commentrouters');
app.use('/', commentrouters);

const contactrouters = require('./routes/contactrouters');
app.use('/', contactrouters);

const payrouters = require('./routes/payrouters');
app.use('/', payrouters);

const messrouters = require('./routes/messrouters');
app.use('/', messrouters);


// chạy server
app.listen(3000, () =>{
    console.log('http://localhost:3000');
});

