const express = require('express');
const router = express.Router();
const userHander = require('../router_handler/user');
//中间件
const expressJoi = require('@escook/express-joi');
//规则对象
const { reg_login_schema } = require('../schema/user')
//注册
router.post('/reguser',expressJoi(reg_login_schema),userHander.regUser)
// router.post('/reguser',userHander.regUser)
//登录
router.post('/login',expressJoi(reg_login_schema),userHander.login)

/**
 * @swagger
 * /api/hello:
 *  get:
 *   tags:
 *      -登录
 *  summary: 登录
 *  description: 登录详细描述
 *  responses:
 *      200:
 *          description: 成功登录
 */
router.get('/hello',(req,res)=>{
    const name=req.query.name
    res.send(`world${name}`)
})

//暴露
module.exports = router