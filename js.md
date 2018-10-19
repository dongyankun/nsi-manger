1.node 最原始服务端渲染
	let http=require('http')
	let fs=require('fs')

	let baseurl="C:\\Users\\123456\\Desktop\\前端整理\\node"
	//注意要转义,\\才相当于下级目录

	let server=http.createServer()
	server.on('request',function(req,res){
		//先读取文件
		fs.readFile('./index.html',function(err,data){
			if(err){
				return res.end('404 not found')
			}else{
				//读取目录,渲染模板
				fs.readdir(baseurl,function(err,files){
					if(err){
						return res.end('404 not found')
					}else{
						//利用字符串替换来实现模板渲染
						let flagStr=''
						files.forEach(function(item){
							flagStr+=`<li>${item}</li>`
						})
						let htmlData=data.toString()
						let htmlData2=htmlData.replace('$$',flagStr)
						res.end(htmlData2)
					}
				})
				
			}
		})
	})
	server.listen(3000,function(){
		console.log('server is running')
	})
2.引入art-template实现模板渲染
	网址:https://github.com/aui/art-template
	文档:https://aui.github.io/art-template/zh-cn/index.html
	//首先安装npm install art-template
	//引入require('art-template')
	//使用template.render('字符串模板',要传递的对象)
	let http=require('http')
	let fs=require('fs')
	let template=require('art-template')

	let baseurl="C:\\Users\\123456\\Desktop\\前端整理\\node"//注意要转义,\\才相当于下级目录

	let server=http.createServer()
	server.on('request',function(req,res){
		//读取文件
		fs.readFile('./artTemplate.html',function(err,data){
			fs.readdir(baseurl,function(err,files){
				if(err){
					return res.end('404 not found')
				}else{
					let htmlData=template.render(data.toString(),{
						title:'artTemplate模板渲染',
						files:files
					})
					res.end(htmlData)
				}
			})
		})
	})
	server.listen(3000,function(){
		console.log('server is running')
	})
3.记事本练手
	//首先安装npm install art-template
	//引入require('art-template')
	//使用template.render('字符串模板',要传递的对象)
	let http=require('http')
	let fs=require('fs')
	let url=require('url')
	let template=require('art-template')

	//要模板渲染的数据
	let contents=[{
		name:'小三',
		say:'你好',
		date:'2018-08-10'
	},{
		name:'小四',
		say:'怒好',
		date:'2018-08-10'
	},{
		name:'小五',
		say:'很好',
		date:'2018-08-10'
	}]

	let server=http.createServer()
	server.on('request',function(req,res){
		//根据访问的路径不同,配置不同的页面展示,即路由,这种方式
		if (req.url=='/') {//主页
			fs.readFile('./feedBook/index.html',function(err,dataindex){
				if(err){
					fs.readFile('./feedBook/404.html',function(err,data404){
						if(err){
							return res.end('404 not found')
						}else{
							return res.end(data404)
						}
					})
				}else{
					let htmldata=template.render(dataindex.toString(),{
						item:contents
					})
					res.end(htmldata)
				}
			})
		}else if(req.url=='/post'){
			//发布页面
			fs.readFile('./feedBook/post.html',function(err,data){
				if(err){
					return res.end('404 not found')
				}else{
					res.end(data)
				}
			})
		}else if(req.url.indexOf('/plugn')==0){
			//如果是请求plugn,路由重定向
			const urlPase=url.parse(req.url,true)
			let flagcontent=urlPase.query
			flagcontent.date='2019-09-09'
			contents.push(flagcontent)
			//路由重定向
			res.statusCode=302//设置路由重定向状态码302临时重定向,301永久重定向
			res.setHeader('Location','/')//设置重定向地址/,去主页
			res.end()
			
		}else if(req.url.indexOf('/public/')==0){
			//静态资源加载,即发布一个public文件夹,公开public文件夹
			fs.readFile('./feedBook'+req.url,function(err,data){
				if(err){
					return res.end('404 not found')
				}else{
					res.end(data)
				}
			})
		}
	})
	server.listen(3000,function(){
		console.log('server is running')
	})