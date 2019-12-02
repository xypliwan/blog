const router = require('koa-router')()
const {
    ErrorModel
} = require('../model/resModel')
const {
    getList
} = require('../controller/blog')
const loginCheck = require('../middleware/loginCheck')

router.prefix('/api/blog')
router.get('/list', loginCheck, async (ctx, next) => {
    let author = ctx.query.author || '';
    const keyword = ctx.query.keyword || '';

    if (ctx.query.isadmin) {
        const loginCheckResult = loginCheck(req);
        if (loginCheckResult) {
            //未登录
            return loginCheckResult
        }
        if (ctx.session.username == null) {
            ctx.body = new ErrorModel('未登录')
            return;
        }

        //强制查询自己的博客
        author = ctx.session.username
    }
    const listData = await getList(author, keyword);
    ctx.body = new SuccessModel(listData);

})

module.exports = router