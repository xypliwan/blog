const querystring = require('querystring')
const {
    get,
    set
} = require('./src/db/redis')
const handleBlogRouter = require('./src/router/blog');
const handleUserRouter = require('./src/router/user');
const {
    access
} = require('./src/utils/log')

//获取cookie过期时间
const getCookieEcpires = () => {
    const d = new Date();
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
    return d.toGMTString()
}

// session 数据
// let SESSION_DATA = {}


//用于处理 post data
const getPostData = (req) => {
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
    //记录access log
    access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`)

    // res.setHeader("Access-Control-Allow-Origin", "*");
    //跨域允许的header类型
    // res.setHeader("Access-Control-Allow-Headers", "Content-type,Content-Length,Authorization,Accept,X-Requested-Width");
    // 设置返回格式 JSON
    res.setHeader('Content-type', 'application/json')

    //获取path
    const url = req.url;
    req.path = url.split('?')[0];

    //解析 query
    req.query = querystring.parse(url.split('?')[1]);

    //解析 cookie
    req.cookie = {};
    const cookieStr = req.headers.cookie || ''; //k1=v1;k2=v2;k3=v3
    cookieStr.split(';').forEach(item => {
        if (!item) return;
        const arr = item.split('=');
        const key = arr[0].trim();
        const val = arr[1].trim();
        req.cookie[key] = val;
    })

    //解析session
    // let needSetCookie = false
    // let userId = req.cookie.userid
    // if (userId) {
    //     if (!SESSION_DATA[userId]) {
    //         SESSION_DATA[userId] = {};
    //     }
    // } else {
    //     needSetCookie = true;
    //     userId = `${Date.now()}_${Math.random()}`;
    //     SESSION_DATA[userId] = {};
    // }
    // req.session = SESSION_DATA[userId];

    // 解析 session （使用 redis）
    let needSetCookie = false
    let userId = req.cookie.userid
    if (!userId) {
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        // 初始化 redis 中的 session 值
        set(userId, {})
    }
    // 获取 session
    req.sessionId = userId
    get(req.sessionId).then(sessionData => {
            if (sessionData == null) {
                // 初始化 redis 中的 session 值
                set(req.sessionId, {})
                // 设置 session
                req.session = {}
            } else {
                // 设置 session
                req.session = sessionData
            }
            // console.log('req.session ', req.session)

            // 处理 post data
            return getPostData(req)
        })
        .then(postData => {
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
                    if (needSetCookie) {
                        //操作cookie
                        //httpOnly  只允许后端修改cookie，前端不能改
                        res.setHeader('Set-Cookie', `userid=${userId}`, 'path=/; httpOnly; ', `expires=${getCookieEcpires()}`)
                    }
                    res.end(
                        JSON.stringify(blogData)
                    )
                })
                return;
            }



            //处理user路由
            // const userData = handleUserRouter(req, res);
            // if (userData) {
            //     res.end(
            //         JSON.stringify(userData)
            //     )

            //     return;
            // }
            const userResult = handleUserRouter(req, res)
            if (userResult) {
                userResult.then(userData => {
                    if (needSetCookie) {
                        //操作cookie
                        //httpOnly  只允许后端修改cookie，前端不能改
                        res.setHeader('Set-Cookie', `userid=${userId}`, 'path=/; httpOnly; ', `expires=${getCookieEcpires()}`)
                    }
                    res.end(
                        JSON.stringify(userData)
                    )
                })
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