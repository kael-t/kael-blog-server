var express = require('express');
var router = express.Router();
var Blogger = require('../model/blogger');// 引入blogger模型
var utils = require('../lib/utils');// 引入工具类

router.get('/', function(req, res, next) {
    res.send('this is blogger.js');
});

router.post('/getBloggerInfo',function (req, res, next) {
    Blogger.getBloggerInfo().then(function (blogger) {
        if (!blogger) {
            req.flash('error', '博主不存在');
            return res.json(utils.setError(null, '博主不存在'));
        }
        return res.json(utils.setResult(blogger[0]));
    });
});

router.post('/setBlogger',function (req, res, next) {
    var blogger = {
        name: 'tangjiahao',
        personalizedSignature: '人生若只如初见,何事秋风悲画扇',
        avatar: '15102266711322.jpg',
        qq: '490384166',
        weibo: '@Mr___TTTTTTTT',
        aboutMe: '坐标:guangzhou' +
                 '<div>目前还是个本科狗</div>' +
                 '<div>有个很好的女朋友,希望未来能好好的</div>' +
                 '<div>喜欢小猫小狗但是偏偏女朋友害怕</div>' +
                 '<div>前端菜鸡一个</div>' +
                 '<div>想减肥(但是停留在想的阶段)</div>',
    };

    Blogger.setBlogger(blogger).then(function (result) {
        blogger = result;
        return res.json(utils.setResult(null, '操作成功'));
    }).catch(function (e) {
        // 用户名被占用则跳回注册页，而不是错误页
        return res.json(e);
    });
});

router.post('/updateBlogger',function (req, res, next) {
    var id = req.body._id;

    var info = req.body.info;

    Blogger.updateBlogger(id, info).then(function (result) {
        return res.json(utils.setResult(null, '更新成功'));
    }).catch(function (e) {
        return res.json(e);
    });
});

module.exports = router;