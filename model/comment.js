var Comment = require('../schema/schema').Comment;

module.exports = {
    // 保存评论
    saveComment: function (comment) {
        return Comment.create(comment)
    },
    
    // 删除评论
    deleteComment: function (options) {
        return Comment.remove(options);
    },

    // 根据文章id查询评论
    getCommentListByArticleId: function (articleId) {
        // path指定填充的字段名, select指定哪些属性需要填充到该字段名中,1:填充 0:不填充
        return Comment.find({articleId: articleId}).populate({path: 'userId',select: {avatar: 1,username: 1} }).exec();
    }
};