var express = require('express');
var router = express.Router();
var Article = require('../model/article');
var utils = require('../lib/utils');

// 获取所有文章列表
router.post('/getArticleList', function (req, res, next) {
    Article.getArticleList().then(function (articles) {
        if(articles.length === 0){
            req.flash('error', '没有文章');
            return res.json(utils.setError(null,'您还没有写任何文章'));
        }
        req.flash('success', '获取成功');
        return res.json(utils.setResult(articles,'获取文章列表成功'))
    }).catch(function (e) {
        return res.json(e);
    });
});

// 根据状态获取文章列表
router.post('/getArticleListByStatus', function (req, res, next) {

    var status = req.body.status;

    Article.getArticleListByStatus(status).then(function (articles) {
        if(articles.length === 0){
            req.flash('error', '没有文章');
            return res.json(utils.setError(null,'暂时还没有' + utils.returnArticleStatus(status) + '的文章'));
        }
        req.flash('success', '获取成功');
        return res.json(utils.setResult(articles,'获取文章列表成功'))
    }).catch(function (e) {
        return res.json(e);
    });
});

// 新建文章
router.post('/saveArticle', function (req, res, next) {

    var title = req.body.title;
    var content = req.body.content;
    var classify = req.body.classify;
    var createDate = req.body.createDate;
    var status = req.body.status;

    var article = {
        title: title,
        content: content,
        classify: classify,
        createDate: createDate,
        status: status,
    };

    Article.saveArticle(article).then(function (article) {
        return res.json(utils.setResult({
            _id: article._id
        }, '新建文章成功'));
    }).catch(function (e) {
        return res.json(utils.setError());
    });
});

// 更新文章
router.post('/updateArticle', function (req, res, next) {

    var _id = req.body._id;
    var title = req.body.title;
    var content = req.body.content;
    var classify = req.body.classify;
    var createDate = req.body.createDate;
    var status = req.body.status;

    var article = {
        title: title,
        content: content,
        classify: classify,
        createDate: createDate,
        status: status,
    };

    Article.updateArticle(_id, article).then(function (article) {
        return res.json(utils.setResult({
            _id: article._id
        }, '更新文章成功'));
    }).catch(function (e) {
        return res.json(utils.setError());
    });
});

// 通过id删除文章
router.post('/deleteArticleById', function (req, res, next) {
    var _id = req.body._id;

    Article.deleteArticleById(_id).then(function (article) {
        return res.json(utils.setResult(null, '删除文章成功'));
    }).catch(function (e) {
        console.log(e);
        return res.json(utils.setError());
    });
});

// 获取文章详情
router.post('/getArticleDetail', function (req, res, next) {
    var _id = req.body._id;

    Article.getArticleById(_id).then(function (article) {
        return res.json(utils.setResult(article, '获取文章成功'));
    }).catch(function (e) {
        console.log(e);
        return res.json(utils.setError());
    });
});

module.exports = router;