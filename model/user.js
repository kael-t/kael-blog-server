var User = require('../schema/schema').User;

module.exports = {
    // 注册一个用户
    create: function (user) {
        return User.create(user);
    },

    // 通过用户名获取用户信息
    getUserByName: function (username) {
        return User
            .findOne({ username: username })
            .exec();
    },

    // 删除全部用户
    delAllUser: function () {
        return User.remove({}).exec();
    },

    // 获取用户列表
    getUserList: function () {
        return User.find({}).exec();
    },

    // 根据id设置管理员
    setAdminById: function (id) {
        return User.update({_id: id}, {$set: {isAdmin: true}});
    }
};