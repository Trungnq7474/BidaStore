// const → tạo biến KHÔNG đổi được
// sql → tên biến (bạn đặt gì cũng được, nhưng thường đặt vậy cho dễ hiểu)
// = → gán giá trị
// require → lệnh import trong Node.js
// 'mssql' → tên thư viện

//  Cả dòng =  “lấy thư viện mssql gán vào biến sql”

const sql = require('mssql');

const config = {
    user: 'sa',
    password: '0352493970',
    server: 'localhost',
    database: 'shopbida',
    options: {
        trustServerCertificate: true
    }
};

// async → hàm bất đồng bộ (cho phép dùng await) ->tạo hàm tên connectDB
// await → chờ kết quả xong mới chạy tiếp
// sql → biến đã import
// connect → hàm kết nối
// (config) → truyền cấu hình

// nghĩa là: dùng config để kết nối SQL Server

async function connectDB() { 
    try {
        await sql.connect(config);
        console.log("Kết nối thành công");
    }

// catch → bắt lỗi
// (err) → biến chứa lỗi

    catch (err) {
        console.log("Lỗi", err);
    }
}

// module → module hiện tại
// exports → xuất ra ngoài
// object gồm: sql,connectDB

// nghĩa là:
// file khác có thể dùng 2 cái này
module.exports = { sql, connectDB };

