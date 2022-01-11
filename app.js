
var confPopUp = document.getElementById("gameConf");
var openConf = document.getElementById("play");
var closeConf = document.getElementById("closeConf");

var host = "twserver.alunos.dcc.fc.up.pt";
host = "localhost";
var port = 8991;

window.onload = function(){
    //register('maria','pass');
    //ranking();
    join(1264857392867, 'ramadamaria', 'pass',5,4);
    //leave('ramadamaria', 'pass',1264857392867);
    // notify('maria','pass',1,2);
    //login('maria','pass');
    // update('maria',1);
}

openConf.onclick = function(){
    confPopUp.style.display = "block";
}

closeConf.onclick = function(){ 
    confPopUp.style.display = "none";
    startGame();
}

var openLogin = document.getElementById("openLogin");
var loginPopup = document.getElementById("login");
var submitLogin = document.getElementById("submitLogin");
var closeLogin  = document.getElementById("closeLogin");

openLogin.onclick = function(){ 
    loginPopup.style.display = "block";
}

submitLogin.onclick = function(){
    //let form = document.getElementById("loginForm");
    //let n = form.elements['nick'].value;
    //let p = form.elements['pass'].value;
    // login(n,p);
    let nick = document.getElementById('nick').value;
    let pass = document.getElementById('pass').value;
    register(nick,pass);
}

closeLogin.onclick = function(){ 
    loginPopup.style.display = "none";
}

//Rules
var rulesPopUp = document.getElementById("rulesPopup");
var openRules = document.getElementById("rules");
var closeRules = document.getElementById("closeRules");

openRules.onclick = function(){
    rulesPopUp.style.display = "block";
}

closeRules.onclick = function(){ 
    rulesPopUp.style.display = "none";
}

//Score Board
var scorePopUp = document.getElementById("scorePopup");
var openScore = document.getElementById("score-board");
var closeScore = document.getElementById("closeScore");
var ai;
var game;
var cells = document.getElementsByClassName("cell");

openScore.onclick = function(){
    scorePopUp.style.display = "block";
}

closeScore.onclick = function(){ 
    scorePopUp.style.display = "none";
}


function startGame(){
    const oldBoard  = document.getElementById('board');
    oldBoard.innerHTML = '';

    const holes  = document.getElementById('holes').value;
    const seeds = document.getElementById('n_seeds').value;
    const ai_diff = document.getElementById('ai_diff').value;
    game = new Game(seeds, holes, ai_diff*2);
    game.draw();
}

function copyBoard(board){
    let newB = new Board(board.cellCount, 0, true);
    newB.storesSeeds[0] = boardst.storesSeeds[0];
    newB.storesSeeds[1] = board.storesSeeds[1];

    newB.cellsSeeds.push([]);
    newB.cellsSeeds.push([]);
    for(let r = 0; r < 2; r++){
        for(let c = 0; c < board.cellCount; c++){
            newB.cellsSeeds[r][c] = board.cellsSeeds[r][c];
        }
    }
    return newB;
}



function join(group, nick, password, size, initial){
    send(JSON.stringify({ 'group': group, 'nick': nick, 'password': password, 'size': size, 'initial': initial}), 'join');
}
function leave(nick, password, game){
    send(JSON.stringify({ 'nick': nick, 'password': password, 'game':game}), 'leave');
}
function notify(nick, password, game, move){
    send(JSON.stringify({ 'nick': nick, 'password': password, 'game':game, 'move':move}), 'notify');
}
function ranking(){
    send("{}", 'ranking');
}

function login(nick, password){
    send(JSON.stringify({ 'nick': nick, 'password': password}), 'login');
}
function register(nick, password){
    send(JSON.stringify({ 'nick': nick, 'password': password}), 'register');
}
function update(nick, game){
    send(JSON.stringify({ 'nick': nick, 'game': game}), 'update');
}


function send(jsonString, route) {
    if(!XMLHttpRequest) { console.log("XHR não é suportado"); return; }
    const xhr = new XMLHttpRequest();
    const display = this.display;

    //xhr.open('POST','http://'+host+':'+port+'/'+route,true);

    xhr.open('POST','http://twserver.alunos.dcc.fc.up.pt:8008/'+route,true);

    console.log("opened xhr");
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
            // const data = JSON.parse(xhr.responseText);
            // display.innerText = data.value;
        }
    }    
    xhr.send(jsonString);
    console.log("sent: " + jsonString);
}

class AI {
    constructor(board, holes, seeds, difficulty){
        this.board = board;
        this.holes = holes;
        this.difficulty = difficulty;
    }

    ai_play(){

        if(this.difficulty == 0){
            let a = Math.random()*this.holes;
            return Math.floor(Math.random() * this.holes);
        }
        return this.ai_play_depth(this.difficulty, this.board).col;
    }

    ai_play_depth(d, board){
        let best = {col: 0, pts: 0};
        if(d == 0) return best;
        let impossible = true;

        for(let c = 0; c < board.cellCount; c++){
            let boardCopy = copyBoard(board);
            if(boardCopy.cellsSeeds[0][c] != 0)
                impossible = false;
        }
        if(impossible)
            return best;

        for(let c = 0; c < board.cellCount; c++){
            let boardCopy = copyBoard(board);
            if(boardCopy.cellsSeeds[0][c] == 0){
                continue;
            }
            boardCopy.executePlay(0,c);
            for(let c2 = 0; c2 < board.cellCount; c2++){
                let boardCopy2 = copyBoard(boardCopy);
                boardCopy2.executePlay(1,c2);
                let next = this.ai_play_depth(d-1,boardCopy2);
                let evals = this.evaluate(boardCopy2) + next.pts;
                if(evals > best.pts){
                    best = {col: c, pts: evals};
                }
            }
        }
        return best;

    }

    evaluate(board){
        return board.storesSeeds[0] - board.storesSeeds[1];
    }



}

class Game{
    constructor(seeds, holes, ai_diff){
        this.board = new Board(holes, seeds);;
        this.player = 1;
        //this.pvp = pvp;
        this.ai = new AI(this.board, holes, seeds, ai_diff);
    }

    execPlay(r, c){
        //Prevents wrong play
        if(r != this.player)
            return;
        let playAgain = this.board.executePlay(r, c);
        
        if(!playAgain && this.player == 1)
            this.player = 0;
        else if (!playAgain)
            this.player = 1;

        if(this.checkEnd()){
            console.log("Game Ended");
            return -1;
        }
        return playAgain;
    }
    

    checkEnd(){
        for(let i = 0; i < this.board.cellCount; i++){
            if (this.board.cellsSeeds[this.player][i] > 0)
                return false;
        }
        return true;
    }
    
    draw(){
        this.board.draw();
    }
    
}

class Board{
    constructor(holes, n_seeds, fake = false){
        const boardEl  = document.getElementById('board'); 
        this.turn = 0;
        this.cellCount = holes;
        this.cells = [];
        this.stores = [];
        this.cellsSeeds = [];
        this.storesSeeds = [];
        if(!fake){

            this.buildStore(boardEl,0);
            
            this.buildCells(boardEl, holes, n_seeds);
            
            this.buildStore(boardEl,1);
        }

    }

    buildStore(boardEl, n){
        this.stores[n] = document.createElement('div'); //Store for PLayer1
        this.stores[n].className = "store";
        this.storesSeeds[n] = 0;
        boardEl.appendChild(this.stores[n]);
    }    

    buildCells(boardEl, holes, n_seeds){
        const rows = document.createElement('div');//Container for the rows
        rows.className = "rows";
        boardEl.appendChild(rows);

        for(let r = 0; r<2; r++){ //Create both rows
            let row = document.createElement('div');
            row.className = "row";
            this.cells.push([]);
            this.cellsSeeds.push([]);
            for(let c = 0; c < holes; c++){
                this.cells[r][c] = document.createElement('div');
                this.cells[r][c].className = "cell";
                this.cellsSeeds[r][c] = parseInt(n_seeds);
                this.cells[r][c].id = r.toString() + c.toString();
                this.cells[r][c].onclick = function(){
                    let x= parseInt(this.id.charAt(0));
                    let y = parseInt(this.id.charAt(1));
                    let playAgain = game.execPlay(x,y);
                    game.draw();
                    if(playAgain)
                        return;
                    
                    while(game.execPlay(0,game.ai.ai_play())> 0){
                        game.draw();
                    }
                    game.draw();
                    
                }
                row.appendChild(this.cells[r][c]);
            }
            rows.appendChild(row);
        }
    }

    
    executePlay(r, c){
        let seeds = this.cellsSeeds[r][c];
        if(seeds == 0) return 1;
        this.cellsSeeds[r][c] = 0;
        let n;   
        let player = r;

        while(seeds > 0){
            switch(r){
                case 0:
                    c--;
                    if(c >= 0){
                        n = this.cellsSeeds[r][c];
                        this.cellsSeeds[r][c] += 1;
                        seeds--;
                        if(player == 0 && n == 0 && seeds == 0){
                            let collect = this.cellsSeeds[1][c];
                            this.cellsSeeds[1][c] = 0;
                            let k = this.storesSeeds[0];
                            this.storesSeeds[0] = k + collect;
                            //return 1;
                        }
                    } else if (player == 0) {
                        r = 1;
                        n = this.storesSeeds[0];
                        this.storesSeeds[0] = n + 1;
                        if (seeds == 1 && player == 0){
                            return 1;
                        }

                        seeds--;
                    } else {
                        r = 1;
                    }
                    break;
                case 1:
                    c++;
                    if(c < this.cellCount){
                        n = this.cellsSeeds[r][c];
                        this.cellsSeeds[r][c] = n + 1;
                        seeds--;
                        if(player == 1 && n == 0 && seeds == 0){
                            let collect = this.cellsSeeds[0][c];
                            this.cellsSeeds[0][c] = 0;
                            let k = this.storesSeeds[1];
                            this.storesSeeds[1] = k + collect;
                            //return 1;
                        }
                    } else if (player == 1){
                        r = 0;
                        n = this.storesSeeds[1];
                        this.storesSeeds[1] = n + 1;
                        if (seeds == 1 && player == 1){
                            return 1;
                        }
                        seeds--;
                    } else {
                        r = 0;
                    }
                    break;
                default:
                    break;
            }
        }
        return 0;
    }

    draw(){
        let nSeeds;
        for(let r = 0; r<2; r++){ 
            for(let c = 0; c < this.cellCount; c++){
                nSeeds = this.cellsSeeds[r][c];
                this.cells[r][c].innerHTML= '';
                for(let s = 0; s < nSeeds; s++){
                    let seed = document.createElement('div');
                    seed.className = "seed";
                    this.cells[r][c].appendChild(seed);
                }
            }
            this.stores[r].innerHTML = '';
            nSeeds = this.storesSeeds[r];
            for(let s = 0; s < nSeeds; s++){
                let seed = document.createElement('div');
                seed.className = "seed";
                this.stores[r].appendChild(seed);
            }
        }

    }
}


async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  } 