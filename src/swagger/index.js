const path = require('path')
const swaggerJsdoc = require('swagger-jsdoc')
// const swaggerui = require('swagger-ui-express')

const options={
    definition:{
        openapi:'3.0.0',
        info:{
            title:"client项目",
            version:'1.0.0',
            description:`项目描述陈某很帅`
        }
    },
    apis:[path.join(__dirname,'../router/*.js')]
}
const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec