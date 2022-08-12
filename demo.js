const http = require('http');
const url = require('url');
const stringDecoder = require('string_decoder').StringDecoder;
const fs = require('fs');
const qs = require('qs');
const port = 3000;


let handle = {};

handle.home = function (req,res){
    fs.readFile('./view/home.html','utf-8', (err, data)=>{
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.write(data);
        return res.end()
    })
}

handle.login = function (req,res){
    fs.readFile('./view/login.html','utf-8', (err, data)=>{
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.write(data);
        return res.end()
    })
}

handle.profile = function (req,res){
   let data = '';
   req.on('data', (chunk)=>{
       data += chunk;
   })
    req.on('end',()=>{
        data = qs.parse(data);
        let name = data.nameUser
        let stringObject = `<h1>Hello ${name} </h1>`;
        console.log(name);
        fs.writeFile('./view/profile.html', stringObject, (err, data)=>{
            if(err){
                throw new Error(err.message);
            }
            console.log('Ghi du lieu vao thanh cong!!');
            console.log('Doc du lieu vua duoc ghi');
            fs.readFile('./view/profile.html','utf-8',(err ,data)=>{
                res.writeHead(200, {'Content-Type' : 'text/html'});
                res.write(data);
                return res.end();
            })
        })
    })
}

handle.notfound = function (req,res){
    fs.readFile('./view/notfound.html','utf-8', (err, data)=>{
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.write(data);
        return res.end()
    })
}

let router = {
    'login' : handle.login,
    'home' : handle.home,
    'profile' : handle.profile
}


let server = http.createServer((req,res)=>{
    let parseUrl = url.parse(req.url, true);

    let path = parseUrl.pathname;
    let trimPath = path.replace(/^\/+|\/+$/g,'');

    if(req.method === 'GET'){
        let chosenHandle = (typeof router[trimPath] !== 'undefined') ? router[trimPath] : handle.notfound;
        chosenHandle(req,res);
    }
    else {
        let chosenHandle = router.profile;
        chosenHandle(req,res);
    }
})

server.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`)
})


