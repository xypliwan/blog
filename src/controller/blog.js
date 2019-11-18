const {
    exec
} = require('../db/mysql');

const getList = (author, keyword) => {
    let sql = `select * from blogs where 1=1 `
    if (author) {
        sql += `and author='${author}`
    }
    if (keyword) {
        sql += `and title like '%${keyword}%`   //like模糊查询
    }
    sql += `order by createtime desc;` //根据createtime  进行倒序排序（desc）

    //返回promise
    return exec(sql);

}

const getDetail = (id) => {
    return {
        id: 1,
        title: '标题A',
        content: '内容',
        createTime: 132312312312,
        author: 'zhangsan',
    }
}

const newBlog = (blogData = {}) => {
    return {
        id: 3,

    }
}

const updateBlog = (id, bloData = {}) => {
    return true;
}

const delBlog = (id) => {
    return true;
}



module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}