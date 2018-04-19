var express = require('express');
var router = express.Router();
var fs = require('fs');
var User = require('../model/user');// 引入user模型
var utils = require('../lib/utils');// 引入工具类
var multiparty = require('multiparty');

router.get('/', function(req, res, next) {
    return res.send('this is user api');
});

// 添加用户
router.post('/addUser', function (req, res, next) {
    var form = new multiparty.Form();
    form.uploadDir = 'resources/images/';
    form.parse(req, function (err, fields, files) {

        if (files.headImgFile) {
            var tmpPath = files.headImgFile[0].path;

            //移动到指定的目录，一般放到public的images文件下面
            //在移动的时候确定路径已经存在，否则会报错
            var targetPath = 'resources/images/' + new Date().getTime().toString() + files.headImgFile[0].originalFilename;

            //将上传的临时文件移动到指定的目录下
            fs.renameSync(tmpPath, targetPath);  //重命名
        }else {
            return res.json(utils.setError(null,'请上传头像'));
        }

        var username = fields.username[0];
        var password = fields.password[0];
        var passwordRepeat = fields.passwordRepeat[0];
        var selfIntroduce = fields.selfIntroduce[0];
        var sex = fields.sex[0];
        // 校验参数
        try {
            if (!(username.length >= 1 && username.length <= 10)) {
                throw new Error('名字请限制在 1-10 个字符');
            }
            if (password.length < 6) {
                throw new Error('密码至少 6 个字符');
            }
            if (password !== passwordRepeat) {
                throw new Error('两次输入密码不一致');
            }
        } catch (e) {
            // 注册失败，异步删除上传的头像
            fs.unlink(targetPath);
            req.flash('error', e.message);
            return res.json(utils.setError(null,e.message))
            // return res.redirect('/');
        }

        var user = {
            username: username,
            password: password,
            selfIntroduce: selfIntroduce,
            sex: sex,
            avatar: targetPath,
        };

        // 保存user，加入错误处理，即把错误作为响应返回
        User.create(user).then(function (result) {
            user = result;
            delete user.password;// 删除密码信息
            req.session.user = user;// 用户信息写入session
            return res.json(utils.setResult({
                id: user._id
            },'操作成功'));
        }).catch(function (e) {
            // 注册失败，异步删除上传的头像
            fs.unlink(targetPath);
            // 用户名被占用则跳回注册页，而不是错误页
            if (e.message.match('E11000 duplicate key')) {
                req.flash('error', '用户名已被占用');
                return res.json(utils.setError(null,'用户名已被占用'));
            }
            next(e);
        });
    });
});

// 登录
router.post('/login', function (req, res, next) {
    var form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {
        var username = fields.username[0];
        var password = fields.password[0];

        User.getUserByName(username).then(function (user) {
            if (!user) {
                req.flash('error', '用户不存在');
                return res.json(utils.setError(null,'用户不存在'));
            }
            // 检查密码是否匹配
            if (password !== user.password) {
                req.flash('error', '用户名或密码错误');
                return res.json(utils.setError(null,'用户名或密码错误'));
            }
            req.flash('success', '登录成功');
            // 用户信息写入 session
            delete user.password;
            req.session.user = user;
            return res.json(utils.setResult({
                id: user._id
            },'登陆成功'))
        })
    });
});

// 获取用户列表
router.post('/getUser', function (req, res) {
    User.getUserList(function(err, users) {
        if (err){
            return res.send(err);
        }
        return res.json(utils.setResult(users));
    });
    User.getUserList().then(function (userList) {
        if(userList.length === 0){
            req.flash('error', '没有用户');
            return res.json(utils.setError(null,'没有用户'));
        }
        req.flash('success', '获取成功');
        return res.json(utils.setResult({
            user_list: userList
        },'获取用户列表成功'))
    })
});

// 清空用户列表
router.post('/delAllUser', function (req, res, next) {
    User.delAllUser().then(function () {
        req.flash('success', '删除用户成功');
        return res.json(utils.setResult(null,'删除用户成功'));
    }).catch(next);
});

// 退出登录
router.post('/logout', function(req, res, next) {
    // 清空 session 中用户信息
    req.session.user = null;
    req.flash('success', '登出成功');
    // 登出成功后跳转到主页
    return res.json(utils.setResult(null,'登出成功'));
});

// 设置为管理员
router.post('/setAdmin', function (req, res, next) {
    var id = req.body.id;
    User.setAdminById(id).then(function (result) {
        req.flash('success', '设置管理员成功');
        return res.json(utils.setResult(null,'设置管理员成功'));
    }).catch(function (e) {
        return res.json(e);
    });
});

module.exports = router;