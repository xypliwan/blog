const {
    exec
} = require('../db/mysql');

const getList = async (author, keyword) => {
    let sql = `select * from blogs where 1=1 `
    if (author) {
        sql += `and author='${author}'`
    }
    if (keyword) {
        sql += `and title like '%${keyword}%' ` //like模糊查询
    }
    sql += `order by createtime desc;` //根据createtime  进行倒序排序（desc）

    //返回promise
    return await exec(sql);

}

const getDetail = async (id) => {
    const sql = `select * from blogs where id='${id}';`;
    const rows = await exec(sql);
    return rows[0]
}

const newBlog = async (blogData = {}) => {
    const title = blogData.title;
    const content = blogData.content;
    const author = bloData.author;
    const createtime = Date.now();

    const sql = `
        insert into blogs (title,content, createtime, author)
        values ('${title}','${content}',${createtime},'${author}');
    `

    const insertData = await exec(sql);
    return {
        id: insertData.insertId
    }

}

const updateBlog = async (id, bloData = {}) => {
    const title = bloData.title;
    const content = bloData.content;

    const aql = `
        update blogs set title='${title}', content='${content}' where id=${id}
    `
    const updateData = await exec(sql);
    if (updateData.affectedRows > 0) {
        return true
    } else {
        return false
    }

}

const delBlog = async (id, author) => {
    const sql = `delete from blogs where id='${id}' and author='${author}';`

    const delData = await exec(sql);
    if (delData.affectedRows > 0) {
        return true
    } else {
        return false
    }

}



module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}