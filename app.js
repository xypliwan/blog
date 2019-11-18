const querystring = require('querystring')
const handleBlogRouter = require('./src/router/blog');
const handleUserRouter = require('./src/router/user');

//用于处理 post data
const getPosData = (req) => {
    const promise = new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            resolve({});
            return;
        }
        if (req.headers['content-type'] !== 'application/json') {
            resolve({});
            return;
        }

        let postData = '';
        req.on('data', chunk => {
            postData += chunk.toString()
        })
        req.on('end', () => {
            if (!postData) {
                resolve({});
                return;
            }
            resolve(JSON.parse(postData));
        })

    })
    return promise;
}

const serverHandle = (req, res) => {
    // 设置返回格式 JSON
    res.setHeader('Content-type', 'application/json')

    //获取path
    const url = req.url;
    req.path = url.split('?')[0];

    //解析 query
    req.query = querystring.parse(url.split('?')[1]);

    //处理post data
    getPosData(req).then(postData => {
        req.body = postData;

        //处理blog路由
        // const blogDataaa = handleBlogRouter(req, res);
        // if (blogDataaa) {
        //     res.end(
        //         JSON.stringify(blogDataaa)
        //     )

        //     return;
        // }
        const blogResult = handleBlogRouter(req, res);
        if (blogResult) {
            blogResult.then(blogData => {
                console.log(blogData, 'blogDatablogData')
                res.end(
                    JSON.stringify(blogData)
                )
            })
            console.log(2222222)
            return;
        }



        //处理user路由
        const userData = handleUserRouter(req, res);
        if (userData) {
            res.end(
                JSON.stringify(userData)
            )

            return;
        }


        //404
        res.writeHead(404, {
            "Content-type": "text/plain"
        });
        res.write('404 node found\n');
        res.end();
    })




}

module.exports = serverHandle

// process.env.NODE_ENV