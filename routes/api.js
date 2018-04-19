var express = require('express');
var router = express.Router();
var utils = require('../lib/utils');// 引入工具类

router.get('/', function(req, res, next) {
    res.send('this is api.js');
});

router.post('/checkLoginOrNot', function (req, res, next) {
    if (req.session.user) {
        req.flash('success', '已登录');

        res.json(utils.setResult({login:true}))
    }else {
        req.flash('success', '未登录');
        res.json(utils.setResult({login:false}))
    }
});

router.post('/test', function (req, res, next) {
    console.log(req.body)
})

module.exports = router;