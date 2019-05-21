var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require("querystring")

function temp(title, list, body, control){
  return `
            <!DOCTYPE html>
              <html>
              <head>
                <title>WEB1 - ${title}</title>
                <meta charset="utf-8">
              </head>
              <body>
                <h1><a href="/">WEB2</a></h1>
                ${list}
                ${control}
                ${body}
              </body>
              </html>
          `;
}
function templist(filelist){
  var list = `<ul>`;
  for(var i=0; i<filelist.length; i++)
    list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
  list += `</ul>`;
  return list;
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url,true).pathname;
    console.log(pathname)
    // console.log(url.parse(_url, true));
    if(pathname === "/"){
      if(queryData.id === undefined){

        fs.readdir('./data', function(err, filelist){
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = templist(filelist);
          var template = temp(title, list, 
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`
            );
          response.writeHead(200);
          response.end(template);
        })
          
      }else {
        fs.readdir('./data', function(err, filelist){
          fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
            var title = queryData.id;
            var list = templist(filelist);
            var template = temp(title, list,
             `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
             );
            response.writeHead(200);
            response.end(template);
          })
        });
      }
    }else if(pathname == "/create"){
      fs.readdir('./data', function(err, filelist){
        var title = 'Welcome';
        var list = templist(filelist);
        var template = temp(title, list, `
          <form action="http://localhost:3000/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p><button type="submit">submit</button></p>
          </form>
        `,'');
        response.writeHead(200);
        response.end(template);
      })
    }else if(pathname == "/create_process"){
      var body = "";
      request.on("data", function(data){
        body += data;
      })
      request.on("end", function(){
        var post = qs.parse(body);
        var title = post.title;
        var description = post.description;
        fs.writeFile(`data/${title}`, description, 'utf8', function(err){
          response.writeHead(302, {Location:`/?id=${title}`});
          response.end();
        })
      })
    }else if(pathname == "/update"){
      fs.readdir('./data', function(err, filelist){
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
          var title = queryData.id;
          var list = templist(filelist);
          var template = temp(title, list,
           `
          <form action="http://localhost:3000/update_process" method="post">
          <input type="hidden" name="id" value="${title}">
            <p><input type="text" name="title" placeholder="title" value="${title}"></p>
            <p>
              <textarea name="description" placeholder="description">${description}</textarea>
            </p>
            <p><button type="submit">submit</button></p>
          </form>
           `
           );
          response.writeHead(200);
          response.end(template);
        })
      })
    }else if(pathname == "/update_process"){
      var body = "";
      request.on("data", function(data){
        body += data;
      })
      request.on("end", function(){
        var post = qs.parse(body);
        var id = post.id;
        var title = post.title;
        var description = post.description;
        fs.rename(`data/${id}`, `data/${title}`,function(err){
          fs.writeFile(`data/${title}`, description, 'utf8', function(err){
            response.writeHead(302, {Location:`/?id=${title}`});
            response.end();
          })
        })
        console.log(post)
      })
    }else{
      response.writeHead(404);
      response.end('Not found');
    }

});
app.listen(3000);