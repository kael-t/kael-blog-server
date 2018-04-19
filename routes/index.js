var fs = require('fs');
var path = require('path');
var checkIsAdmin = require('../middleware/check').checkIsAdmin;

module.exports = function (app) {

    var _path = app.get('path');// 获取静态文件路径

    // 返回index视图
    app.get('/', function (req, res) {
        res.sendFile(path.join(_path, 'index.html'));
    });

    // 返回admin视图
    app.get('/admin', checkIsAdmin, function (req, res) {
        res.sendFile(path.join(_path, 'admin.html'));
    });

    // 分发api模块
    app.use('/api', require('./api'));

    // 分发user模块
    app.use('/user', require('./user'));

    // 分发blogger模块
    app.use('/blogger', require('./blogger'));

    // 分发article模块
    app.use('/article', require('./article'));

    // 分发comment模块
    app.use('/comment', require('./comment'));

    // 404 page
    // app.use(function (req, res) {
    //     if (!res.headersSent) {
    //         res.status(404).render('404');
    //     }
    // });
};