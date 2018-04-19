var utils = require('../lib/utils');// 引入工具类

module.exports = {
    checkLogin: function (req, res, next) {
        if (!req.session.user) {
            req.flash('error', '未登录');
        }
        next();
    },

    checkNotLogin: function (req, res, next) {
        if (req.session.user) {
            req.flash('error', '已登录');
        }
        next();
    },

    checkIsAdmin: function (req,res, next) {
        if (!req.session.user) {
            req.flash('error', '未登录');
            return res.json(utils.setError(null, '对不起，您还没有登录'));
        }
        if (!req.session.user.isAdmin) {
            req.flash('error', '非管理员');
            return res.json(utils.setError(null, '对不起，您没有管理员权限'));
        }
        next();
    }
};