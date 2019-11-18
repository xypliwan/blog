const mysql = require('mysql');

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456789',
    database: 'myblog'
});

//连接
con.connect()

//执行sql语句
const sql = 'select * from users;';
con.query(sql,(err,result)=>{
    if(err){
        console.log(err);
        return
    }
    console.log(result)
})

//关闭连接
con.end()