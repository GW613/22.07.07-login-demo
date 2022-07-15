var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if(!port){
  console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
  process.exit(1)
}

var server = http.createServer(function(request, response){
  var parsedUrl = url.parse(request.url, true)
  var pathWithQuery = request.url 
  var queryString = ''
  if(pathWithQuery.indexOf('?') >= 0){ queryString = pathWithQuery.substring(pathWithQuery.indexOf('?')) }
  var path = parsedUrl.pathname
  var query = parsedUrl.query
  var method = request.method

  /******** 从这里开始看，上面不要看 ************/

  console.log('有个傻子发请求过来啦！路径（带查询参数）为：' + pathWithQuery)

  if(path === '/'){
    response.statusCode = 200
var string = fs.readFileSync('./index.html')
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.end(string)
  }else if(path === '/signUp' && method === 'POST'){
    getPostData(request,function(postData){
     let errors=checkPostData(postData)
        if (Object.keys(errors).length === 0){
            //数据库
            let {email,password} = postData
            let user= {
                email: email,
                passwordHash: GWHash(password)
            }
            //写入数据
            let dbString = fs.readFileSync('./db.json','utf-8')
            let dbObject = JSON.parse(dbString)
            dbObject.users.push(user)
            let dbString2 = JSON.stringify(dbObject)
            fs.writeFileSync('./db.json',dbString2,{encoding:'utf-8'})
        }else{
            response.statusCode=400
        }
     response.setHeader('content-Type','text/html;charset=utf-8')
      response.end(JSON.stringify(errors))
    })
    //获取post数据
  }else if(path ==='/login' && method === 'POST'){
      getPostData(request,(postData)=>{
          let dbString = fs.readFileSync('./db.json','utf-8')
          let dbObject =JSON.parse(dbString)
          let users = dbObject.users

          let {email,password} =postData
          let found
          for(let i=0;i<users.length;i++){
              if(users[i].email ===email && users[i].passwordHash ===GWHash(password)){
               found = users[i]
                  break
              }
          }
          if(found){
        //标记用户已经登录过了（cookie）
              response.setHeader('set-cookie',['logined=true;expires=100;path=/','user_id='+email+';expires=12345678;path=/;'])
              response.end('')
          }else{
              response.statusCode =400
              response.setHeader('content-Type','text/html;charset=utf-8')
              let errors ={email:'没有注册或密码错误'}
              response.end(JSON.stringify(errors))
          }
      })
  }else if(path ==='/main.js'){
     let string = fs.readFileSync('./main.js')
      response.setHeader('Content-Type','application/javascript;charset=utf-8')
      response.end(string)
  }else if(path ==='/home'){
      let cookies = parseCookies(request.headers.cookie)
      response.setHeader('Content-Type', 'text/html;charset=utf-8')
      if (cookies.logined ==='true'){
         response.end(`${cookies.user_id}已登录`)
      }else{
          let string = fs.readFileSync('./home')
          response.end(string)
      }
    }else {
    response.statusCode = 404
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write(`你输入的路径不存在对应的内容`)
    response.end()
  }

  /******** 代码结束，下面不要看 ************/
})

function getPostData(request,callback){
  data =''
  request.on('data',(postData)=>{
    data +=postData.toString()
  })
  request.on('end',()=>{
    let array =data.split('&')
    let postData = {}
    for(let i=0;i<array.length;i++){
     let parts = array[i].split('=')
      let key =decodeURIComponent(parts[0])
      let value =decodeURIComponent( parts[1])
      postData[key]=value
    }
   callback.call(null,postData)
  })
}

function checkPostData(postData){
    let {email,password,password_confirmation} = postData
    let errors = {}
    //check
    if(email.indexOf('@') <=0) {
        errors.email = '邮箱不合法'
    }
    if(password.length<8){
        errors.password='密码太少'
    }
    if(password_confirmation !== password){
        errors.password_confirmation = '两次密码不一致'
    }
    return errors
}

function GWHash (string){
    return 'GW'+string+'GW'
}

function parseCookies(cookie){
    return cookie.split(';').reduce(
        function(prev,curr){
            let m = / *([^=]+)=(.*)/.exec(curr)
            let key =m[1]
            let value = decodeURIComponent(m[2])
             prev[key] = value
            return prev
        },
        { }
    )
}

function stringifyCookies(cookies){
    let list =  []
    for (let key in cookies){
        list.push(key + '=' + encodeURIComponent(cookies[key]))
    }
    return list.join(';')
}

server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)
