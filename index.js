
const http = require('http');
const url = require('url');
const fs = require('fs');
const crypto = require('crypto');

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
        doPost(req,res, path);
    }
    else if(req.method === 'GET'){
        doGet(req,res, path);
    }
    else{
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

function doGet(req,res, path){

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