var Blogger = require('../schema/schema').Blogger;

module.exports = {
    getBloggerInfo: function () {
        return Blogger.find().exec();
    },

    setBlogger: function (blogger) {
        return Blogger.create(blogger);
    },

    updateBlogger: function (id, info) {
        return Blogger.update({_id: id},{$set: {name: info.name,personalizedSignature: info.personalizedSignature,qq: info.qq, weibo: info.weibo, aboutMe: info.aboutMe}});
    }
};