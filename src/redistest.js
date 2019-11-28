const redis = require('redis');

//创建客户端
const redisClient = redis.createClient(6379, '127.0.0.1')

redisClient.auth('123456', () => {
    console.log('认证成功')
})

redisClient.on('error', err => {
    console.log(err, 'redis-err')
})

//ceshi
redisClient.set('myname', 'xyp222', redis.print)
redisClient.get('myname', (err, val) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log('val', val)

    //退出
    redisClient.quit();

})