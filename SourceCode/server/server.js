var Config, HTTPError, Session, Utility, app, authentication, bodyParser, cacheControl, compression, cookieParser,
 cors, env, errorHandler, express, server, userRouter;

express = require('express');

cookieParser = require('cookie-parser');

bodyParser = require('body-parser');
//Gzip压缩
compression = require('compression');

cors = require('cors');

Config = require('./conf');

Session = require('./util/session');

Utility = require('./util/util').Utility;

HTTPError = require('./util/util').HTTPError;

userRouter = require('./routes/user');

app = express();

//跨域验证
app.use(cors({
  origin: Config.CORS_HOSTS,
  credentials: true
}));

//开启Gzip压缩，需要在所有中间件之前加载
app.use(compression());
//开启cookie
app.use(cookieParser());

app.use(bodyParser.json());

app.use('/user', userRouter);

server = app.listen(Config.SERVER_PORT, function() {
  env = 'development';
  var map = {
    development: '开发环境',
    production: '生产环境'
  };
  return console.log('%s服务已启动，地址: http://%s:%s', map[app.get('env')], server.address().address, server.address().port);
});

module.exports = app;