
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const conf = require('./conf.js'); 

// const hash = crypto
//                .createHash('md5')
//                .update(value)
//                .digest('hex');

let credentials = getCredentials("credentials.txt");

function getCredentials(filename){
    let data = fs.readFileSync(filename,'utf8');
    return JSON.parse(data.toString());
}

function saveCredentials(filename){
    write(filename, credentials);
}


const server = http.createServer(function (req, res) {
    
    let path = url.parse(req.url, true);
    res.setHeader('Access-Control-Allow-Origin', '*'); //
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    if(req.method === 'POST'){
        console.log("Received Post");
        doPost(req,res, path);
    }
    else if(req.method === 'GET'){
        console.log("Received Get")
        doGet(req,res);
    }
    else{
        res.writeHead(501); 
        res.end();
    }

});

server.listen(8991);

function doPost(req,res,path){
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
    });

    req.on('end', () => {
        switch(path.pathname){
            case '/login':
                let obj = JSON.parse(body)
                if(login(obj.nick, obj.password))
                    res.writeHead(200, {'Content-Type': 'text/plain'});    
                else
                    res.writeHead(401, {'Content-Type': 'text/plain'});
    
                break;
            default:break;
        }
        //console.log(body);
        res.end();
    });

}

function doGet(request,response) {
    const pathname = getPathname(request);
    if(pathname === null) {
        response.writeHead(403); // Forbidden
        response.end();
    } else 
        console.log("pathname: ", pathname);
        fs.stat(pathname,(err,stats) => {
            if(err) {
                response.writeHead(500); // Internal Server Error
                response.end();
            } else if(stats.isDirectory()) {
                if(pathname.endsWith('/'))
                   doGetPathname(pathname+conf.defaultIndex,response);
                else {
                   response.writeHead(301, // Moved Permanently
                                      {'Location': pathname+'/' });
                   response.end();
                }
            } else 
                doGetPathname(pathname,response);
       });    
}

function getPathname(request) {
    const purl = url.parse(request.url);
    let pathname = path.normalize(conf.documentRoot+purl.pathname);

    if(! pathname.startsWith(conf.documentRoot))
       pathname = null;

    return pathname;
}

function doGetPathname(pathname,response) {
    const mediaType = getMediaType(pathname);
    const encoding = isText(mediaType) ? "utf8" : null;

    fs.readFile(pathname,encoding,(err,data) => {
    if(err) {
        response.writeHead(404); // Not Found
        response.end();
    } else {
        response.writeHead(200, { 'Content-Type': mediaType });
        response.end(data);
    }
  });    
}

function getMediaType(pathname) {
    const pos = pathname.lastIndexOf('.');
    let mediaType;

    if(pos !== -1) 
       mediaType = conf.mediaTypes[pathname.substring(pos+1)];

    if(mediaType === undefined)
       mediaType = 'text/plain';
    return mediaType;
}

function isText(mediaType) {
    if(mediaType.startsWith('image'))
      return false;
    else
      return true;
}


function write(filename, data){
    fs.writeFile(filename, JSON.stringify(data)+"\n",(err) => {
        if(err) throw err;
    });

}

function read(filename){
    fs.readFile(filename,'utf8',function(err,read) {
        if(! err) {
            try{ 
                data = JSON.parse(read.toString());
                console.log(data);
                return data;
            }
            catch (err) {console.log("Error parsing read data")}
            // processar dados
            
        }

    });
}

function register(nick, pass){
    credentials.push({'nick': nick, 'pass': pass});
    saveCredentials("newcredentials.txt");
}


function login(nick, pass){
    for(let i = 0; i < credentials.length; i++)
    {
        if(credentials[i].nick == nick && credentials[i].pass == pass){
            console.log(nick + " logged in.\n");
            return true;
        }
    }   
    console.log("Someone tried to log into " + nick + "'s account with the wrong password");
    return false;
}