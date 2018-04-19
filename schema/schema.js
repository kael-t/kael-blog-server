var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

// 用户视图
var UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    selfIntroduce: {
        type: String,
    },
    avatar: {// 头像路径
        type: String,
    },
    sex: {

    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    regTime: {
        type: Date,
        default: Date.now
    },
    // question:,
    // answer:,
}, {
    connection: 'User', //模型名称,
});

// 博主视图
var BloggerSchema = new Schema({
    name: {
        type: String,
    },
    personalizedSignature: {
        type: String,
    },
    avatar: {// 头像路径
        type: String,
    },
    qq: {// qq
        type: String,
    },
    weibo: {// 微博
        type: String,
    },
    aboutMe: {// 关于我
        type: String,
    }
}, {
    connection: 'Blogger', //模型名称,
});

// 文章视图
var ArticleSchema = new Schema({
    title: {// 标题
        type: String,
    },
    content: {
        type: String,
    },
    classify: {// 分类
        type: String,
        default: '未分类',
    },
    createDate: {// 更新时间
        type: Date,
    },
    status: {// 文章状态 draft:草稿 publish:已发布
        type: String,
    }
}, {
    connection: 'Article', //模型名称,
});

// 评论视图
var CommentSchema = new Schema({
    content: {// 评论内容
        type: String,
    },
    createTime: {// 评论时间
        type: Date,
    },
    userId: {// 用户id
        type: ObjectId,
        ref: 'User',
    },
    articleId: {// 文章id
        type: ObjectId,
        ref: 'Article',
    },
    respond: {// 二级回复id
        type: Number,
        default: null,
    }
});

module.exports = {
    User: mongoose.model('User', UserSchema),
    Blogger: mongoose.model('Blogger', BloggerSchema),
    Article: mongoose.model('Article', ArticleSchema),
    Comment: mongoose.model('Comment', CommentSchema)
};