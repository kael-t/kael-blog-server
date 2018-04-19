// 加载express
var express = require('express');// call express
var session = require('express-session');
var app = express();// 获得express定义的app，app对象此时代表整个web应用
var path=require('path');
var ejs = require('ejs');
var routes = require('./routes');
var config = require('./config/default');
var mongoose = require('mongoose');//加载mongoose模块
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');

bodyParser = require('body-parser');

app.engine('html', require('ejs').renderFile);// 设置html引擎
app.set('view engine', 'html');// 设置视图引擎

// 设置静态文件目录
app.use(express.static(path.join(__dirname, '/webapp')));
app.set('path', path.join(__dirname, '/webapp'));// 保存静态文件路径到全局变量
app.use('/images',express.static(path.join(__dirname, 'resources/images')));

// session 中间件
app.use(session({
    name: config.session.key,// 设置 cookie 中保存 session id 的字段名称
    secret: config.session.secret,// 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
    resave: true,// 强制更新 session
    saveUninitialized: false,// 设置为 false，强制创建一个 session，即使用户未登录
    cookie: {
        maxAge: config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
    },
    store: new MongoStore({// 将 session 存储到 mongodb
        url: config.mongodb// mongodb 地址
    })
}));
// flash 中间件，用来显示通知
app.use(flash());

// 添加模板必需的三个变量
app.use(function (req, res, next) {
    res.locals.user = req.session.user;
    res.locals.success = req.flash('success').toString();
    res.locals.error = req.flash('error').toString();
    next();
});

// 给app配置bodyParser中间件
// 通过如下配置再路由种处理request时，可以直接获得post请求的body部分
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('port', process.env.PORT || config.port); // 设置端口号,端口号在config/default中配置

mongoose.connect(config.mongodb); // 连接数据库,数据库url在config/default中配置

app.all('*',function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:63342');// 允许本地63342端口访问
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

    if (req.method == 'OPTIONS') {
        res.sendStatus(200); //让options请求快速返回
    }
    else {
        next();
    }
});

// 将app传入routes模块，在routes/index.js中做路由同一分发
routes(app);

//开始监听端口
app.listen(app.get('port'),function () {
    console.log('listening on port ' + app.get('port'));
});