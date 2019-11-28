const redis = require('redis');
const {
    REDIS_CONF
} = require('../conf/db');

//创建客户端
// const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)

// redisClient.auth('123456', () => {
//     console.log('认证成功')
// })

// redisClient.on('error', err => {
//     // console.log(err, 'redis-err')
// })

function set(key, val) {
    // if (typeof val === 'object') {
    //     val = JSON.stringify(val)
    // }

    // redisClient.set(key, val, redis.print)


}

function get(key) {
    // const promise = new Promise((resolve, reject) => {
    //     redisClient.get(key, (err, val) => {
    //         if (err) {
    //             reject(err)
    //             return;
    //         }
    //         resolve(val)
    //         if (val === null) {
    //             resolve(null)
    //             return;
    //         }

    //         try {
    //             resolve(
    //                 JSON.parse(val)
    //             )
    //         } catch (ex) {
    //             resolve(val)
    //         }
    //     })
    // })

    // return promise;

    return Promise.resolve({})
}

module.exports = {
    set,
    get
}