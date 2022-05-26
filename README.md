# uni-app-template

## 介绍

此模板是基于 uni-app 的H5、APP、小程序多端一体的框架。

## 安装与运行

**因为本框架依赖Vue CLI 3.x，要求: node.js 版本 8.9 或以上**

安装依赖：

```
cnpm install -g yarn
yarn
```


开发环境运行：npm run dev:环境

```
H5 端:
npm run dev:h5

APP端:
npm run dev:app-plus

微信小程序端:
npm run dev:mp-weixin
```

打包发布：npm run build:环境

```
H5 端:
npm run build:h5

APP端:
npm run build:app-plus

微信小程序端:
npm run build:mp-weixin
```

其他类型平台，请参考：https://uniapp.dcloud.io/quickstart?id=%e8%bf%90%e8%a1%8c%e5%b9%b6%e5%8f%91%e5%b8%83uni-app



## 结构

以下是工程的主要目录文件:

```
|---- dist                              build或者开发环境非h5环境下运行，编译后的各平台代码存放目录
|---- mock                              [可选]接口请求mock数据
|---- public                            内有一个 index.html，是h5页面模板，用于项目生成 html 代码
|---- src
|      |---- assets                     存放css、less、scss、fonts等资源
|      |       |---- fonts
|      |       └---- styles
|      |---- components                 组件目录，存放各种可复用组件
|      |---- pages                      业务页面文件存放的目录，最好按模块分好文件夹
|      |---- static                     存放引用静态资源(如：图片、音频、视频等)的目录，注意：静态资源只能存放于此
|      |       |---- app-plus           按环境区分资源，app环境
|      |       |---- h5                 按环境区分资源，h5环境
|      |       |---- mp-weixin          按环境区分资源，微信小程序环境
|      |       └---- platforms          按环境区分资源，全环境
|      |---- store                      (vuex)store存放位置
|      |---- sub-packages               分包管理
|      |       └---- sub-packages1      子包1
|      |       └---- sub-packages2      子包2
|      |---- utils                      公共包存放目录，如共用的 ajax.js
|      |       └---- request.js         公共ajax请求方法，可在方法内加入ajax请求传入的公共参数，或者错误信息的全局处理等
|      |---- APP.vue                    应用配置，用来配置App全局样式以及监听
|      |---- config.js                  配置文件，用来配置小程序请求域名，也可用来存放一些公用的配置信息
|      |---- main.js                    Vue初始化入口文件
|      |---- manifest.json              配置应用名称、appid、logo、版本等打包信息，或h5端开发环境的proxy代理
|      |---- pages.json                 配置页面路由、导航条、选项卡等页面类信息
|      └---- uni.scss                   公共样式, 可以直接在页面的scss中使用变量无需引入该文件
|---- .env                              公用的环境配置，在所有的环境中被载入(存放一些全局配置, 例如: 超时时间, 重试次数等)
|---- .env.h5-prod                      h5生产环境配置
|---- .env.h5-dev                       h5开发环境配置
|---- .env.weixin                       小程序开发环境配置
|---- .env.weixin-prod                  小程序生产环境配置
|---- .env.weixin-dev                   小程序开发环境配置
|---- .eslintrc.js                      eslint 配置文件
|---- .gitignore                        git 忽略列表
|---- package.json                      项目依赖 npm 包，启动指令
|---- postcss.config.js                 在编译时，编译器会自动转换单位配置,如:转换rpx单位为px
|---- README.md                         项目文档以及说明
|---- tsconfig.js
|---- vue.config.js                     vue-cli4配置文件
```

**注意：**

- static 目录下的 js 文件不会被编译，如果里面有 es6 的代码，不经过转换直接运行，在手机设备上会报错。
- css、less/scss 等资源同样不要放在 static 目录下，请放在 assets 下
- 在非H5的环境中，组件不支持 slot-scope 形式调用，请使用 v-slot 的解构插槽。

## 示例

如何运用此模板开发? 以H5为例，H5用浏览调试即可。微信小程序最好用[微信开发工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)调试。app则可以利用浏览器结合[HbuilderX](https://www.dcloud.io/hbuilderx.html)真机调试。



# 开发注意
- 开发前必须查看[官方文档](https://uniapp.dcloud.io/matter)
- 在开发时遇到问题请先到 [官网](https://uniapp.dcloud.io/) 查找解决方案
- `uni-app`在编译时会修改某些原生组件为`uni-ui`组件，如`input`、`textarea`等
- 小程序有样式隔离，且自定义组件需要添加额外的样式（小程序样式需额外调）
