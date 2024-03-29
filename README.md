# SDAU-Alumni-Information-Query-System

SDAU 万名学子联万村校友查询系统

## 目录

- [说明](#说明)
- [开发指南](#开发指南)
- [服务启动](#服务启动)
- [部署](#部署)
- [框架](#框架)

## 说明

本项目为 SDAU “万名学子联万村” 校友查询系统，旨在为 SDAU “万名学子联万村” 大调研为学生提供服务

## 开发指南

1. 克隆项目

```sh
git clone https://github.com/Alex-McAvoy/SDAU-Alumni-Information-Query-System.git
```

2. 进入项目文件夹并安装依赖

```sh
cd ./SDAU-Alumni-Information-Query-System
npm i
```

## 服务启动

1. 导入数据库
   
2. 启动后端

```sh
cd ./SDAU-Alumni-Information-Query-System/server
node app.js
```

3. 启动前端

```sh
cd ./SDAU-Alumni-Information-Query-System
npm run dev
```

## 部署

1. 前端打包后，使用 nginx 部署
2. 后端（server 文件夹）直接运行

```sh
# 启动
sh ./server/start.sh
# 停止
sh ./server/stop.sh
```


## 使用到的框架

- [Vue](https://cn.vuejs.org/)
- [Node 16.18.1](https://nodejs.org)


