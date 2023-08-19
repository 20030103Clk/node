// 创建服务器
const express = require('express');
const cors = require('cors');
const app = express();

const userRouter = require('./src/router/user');

const joi = require('@hapi/joi');

const swaggerSpec = require('./src/swagger/index');
const swaggerui = require('swagger-ui-express')

//CORS中间件跨域
app.use(cors({
    origin: 'http://localhost', // 允许的来源
    methods: ['GET', 'POST','PUT','DELETE'], // 允许的HTTP方法
    allowedHeaders: ['Content-Type', 'Authorization'] // 允许的头部信息
  }));
app.use(express.urlencoded({ extended:false }));

//成功失败模型
app.use((req,res,next)=>{
  //默认1失败
  res.cc = function(err,status = 1){
    res.send({
      status,
      message: err instanceof Error ? err.message : err,
    })
  }
  next()
})

//解析 Token 中间件
const expressJWT = require('express-jwt')
const config = require('./src/config')
//itheima No1. 0.0
app.use(expressJWT({secret:config.jwtSecretKey}).unless({path:[/^\/api/]}))

//路由
app.use('/api',userRouter)
//swagger路由
app.use('/api-docs',swaggerui.serve,swaggerui.setup(swaggerSpec))

//错误中间件
app.use((err,req,res,next)=>{
  //验证失败导致的错误
  if(err instanceof joi.ValidationError) return res.cc(err)
  //身份认证失败
  if(err.name === 'UnauthorizedError') return res.cc('身份认证失败')
  //未知错误
  res.cc(err)
})

const port =3000;

app.listen(port,()=>{
    console.log(`api server runing http://localhost:${port}`);
})