const bcrypt = require('bcryptjs')
const db = require('../db/index');
const jwt = require('jsonwebtoken');
const config = require('../config')
//注册
exports.regUser = (req,res)=>{
    //获取客户端提交到服务器的用户信息
    const userinfo = req.body
    //校验
    // if(!userinfo.username || !userinfo.password){
    //     return res.cc('用户名或密码不合法');
    // }

    //SQL查询
    const select = 'select * from blog_user where username=?'
    db.query(select,userinfo.username,(err,results)=>{
        if(err){
            // return res.send({ status: 1, message: err.message });
            return res.cc(err)
        }
        //占用
        if(results.length > 0){
            // return res.send({ status: 1, message: '用户名被占用，请更换其他用户名' });
            return res.cc('用户名被占用，请更换其他用户名')
        }
        //加密密码
        userinfo.password = bcrypt.hashSync(userinfo.password, 10)
        // res.send('注册成功')
        //SQL增加
        const add = 'insert into blog_user set ?'
        db.query(add,{ username: userinfo.username, password: userinfo.password },(err,results) => {
            // if(err) return res.send({ status:1,message:err.message })
            if(err) return res.cc(err)
            //判断行数是否为1
        if(results.affectedRows !== 1) return res.cc('注册失败')
        // res.cc('注册成功',0)
        })
    })
    
}

//登录
exports.login = (req,res)=>{
    const userinfo = req.body
    const select = 'select * from blog_user where username=?'
    db.query(select,userinfo.username,function(err,results) {
        if(err) return res.cc(err)
        if(results.length !== 1) return res.cc('登陆失败')
        //判断密码是否一致
        const compareResult = bcrypt.compareSync(userinfo.password,results[0].password)
        //这是一个布尔值compareResult
        if(!compareResult) return res.cc('登陆失败')
        //Token
        const user = { ...results[0], password: '', user_pic: '' }
        //用户信息加密,生产Token字符串
        const tokenStr = jwt.sign(user,config.jwtSecretKey,{ expiresIn:config.expiresIn })
        //调用res.send（）响应给客户端
        res.send({
            status:0,
            message:'登录成功',
            token: 'Bearer ' + tokenStr
        })
    })
    
}