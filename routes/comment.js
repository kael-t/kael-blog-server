var express = require('express');
var router = express.Router();
var Comment = require('../model/comment');
var utils = require('../lib/utils');// 引入工具类

router.get('/', function(req, res, next) {
    res.send('this is comment.js');
});

// 发表评论
router.post('/publishComment', function (req, res, next) {
    var content = req.body.content;
    var createDate = req.body.createDate;
    var userId = req.body.userId;
    var articleId = req.body.articleId;

    var comment = {
        content: content,
        userId: userId,
        createDate: createDate,
        articleId: articleId,
    };

    Comment.saveComment(comment).then(function (comment) {
        return res.json(utils.setResult(null, '发表评论成功'));
    }).catch(function (e) {
        return res.json(utils.setError(null, '评论失败'));
    });
});

// 删除评论
router.post('/deleteComment', function (req, res, next) {
    var _id = req.body._id;
    var userId = req.body.userId;
    var articleId = req.body.articleId;

    var _data = {};
    if(_id) {
        _data._id = _id;
    }
    if(userId) {
        _data.userId = userId;
    }
    if(articleId) {
        _data.articleId = articleId;
    }

    Comment.deleteComment(_data).then(function (comment) {
        return res.json(utils.setResult(null, '删除评论成功'));
    }).catch(function (e) {
        return res.json(utils.setError(null, '删除评论失败'));
    });
});

// 根据文章id查询文章下的所有评论
router.post('/getCommentListByArticleId', function (req, res, next) {
    var articleId = req.body.articleId;

    Comment.getCommentListByArticleId(articleId).then(function (comments) {
        if(comments.length === 0){
            req.flash('error', '没有评论');
            return res.json(utils.setError(null,'本文还没有任何评论'));
        }
        var temp = comments;
        for(var i in temp) {
            delete temp[i].userId.isAdmin;
            console.log(temp[i])
        }
        return res.json(utils.setResult(temp,'获取评论成功'))
    }).catch(function () {
        return res.json(utils.setError(null, '获取评论失败'));
    })
});

module.exports = router;