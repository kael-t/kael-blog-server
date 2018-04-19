var Article = require('../schema/schema').Article;

module.exports = {
    // 获取全部文章列表
    getArticleList: function () {
        return Article.find({}).exec();
    },

    // 根据状态获取文章列表
    getArticleListByStatus: function (status) {
        return Article.find({status: status}).exec();
    },

    // 新建文章
    saveArticle: function (article) {
        return Article.create(article);
    },

    // 更新文章
    updateArticle: function (id, article) {
        return Article.update({_id: id}, {$set: article});
    },

    // 根据id删除文章
    deleteArticleById: function (id) {
        return Article.remove({_id: id});
    },

    // 根据id获取文章
    getArticleById: function (id) {
        return Article.findOne({_id: id});
    }
};