
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const conf = require('./conf.js'); 


let credentials_filename = "credentials.txt"
let credentials = getCredentials(credentials_filename);

let ranking = {'ranking' : 
            [ {'nick': 'maria', 'victories': 11, 'games': 20},
            {'nick': 'rita' , 'victories': 9 , 'games': 20} ]
}


function getCredentials(filename){
    let data = fs.readFileSync(filename,'utf8');
    //fs.close();
    return JSON.parse(data.toString());
}

function saveCredentials(filename){
    console.log(credentials);
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
            case '/register':
                let obj = JSON.parse(body);
                if(register(obj.nick, obj.password)){
                    res.writeHead(200, {'Content-Type': 'text/plain'});    
                    res.write('{}\n');
                }
                else{
                    res.writeHead(401, {'Content-Type': 'text/plain'}); 
                    res.write(JSON.stringify({'error': "User registered with a different password"}));
                }
                break;
            case '/ranking':
                res.writeHead(200, {'Content-Type': 'text/plain'}); 
                res.write(JSON.stringify(ranking));
                break;
            default:
                res.writeHead(501, {'Content-Type': 'text/plain'});    
            break;
        }
        res.end();
    });

}

function write(filename, data){
	console.log("Writing credentials to : " + filename);
    fs.writeFile(filename, JSON.stringify(data)+"\n",(err) => {
        if(err) throw err;
    });

}


function register(nick, pass){
    const hash = crypto
               .createHash('md5')
               .update(pass)
               .digest('hex');
    for(let i = 0; i < credentials.length; i++)
    {
        if(credentials[i].nick == nick && credentials[i].pass == hash){
            console.log(nick + " logged in.\n");
            return true;
        }else if(credentials[i].nick == nick && credentials[i].pass != hash){
            console.log("Someone tried to log into " + nick + "'s account with the wrong password");
            return false;
        }
    }   
    credentials.push({'nick': nick, 'pass': hash});
    saveCredentials(credentials_filename);
    console.log("New user, " + nick + " registered");
    return true;
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
