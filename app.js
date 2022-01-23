
var confPopUp = document.getElementById("gameConf");
var openConf = document.getElementById("play");
var closeConf = document.getElementById("closeConf");
var AIstartBtn = document.getElementById("aistart");

var PVPbtn = document.getElementById("pvp");
var PVPconfig = document.getElementById("pvpconfig");
var PVPconfigCloseBtn = document.getElementById("closePVPConfig");
var PVPstartBtn = document.getElementById("pvpstart");


var ltwServerBtn = document.getElementById("change-to-ltw-server");
var groupServerBtn = document.getElementById("change-to-group-server");

var infoTxt = document.getElementById("info-txt");
var leaveBtn = document.getElementById("leaveBtn");

var host ="http://twserver.alunos.dcc.fc.up.pt";
var ltwServerPort = 8008;
var groupServerPort = 9091;
var port = ltwServerPort;

var gameID = 0;

var pvp = false;
var nick = "";
var pass = "";

var turn = "";

var eventSource;

window.onload = function(){
}

openConf.onclick = function(){
    confPopUp.style.display = "block";
}

AIstartBtn.onclick = function(){
    confPopUp.style.display = "none";
    pvp = false;
    startGame();
}
closeConf.onclick = function(){ 
    confPopUp.style.display = "none";
}

PVPbtn.onclick = function(){
    if(nick == "")
    {
        createPopupAlert("Login first");
        return;
    }
    PVPconfig.style.display = "block";

}

PVPconfigCloseBtn.onclick = function(){
    PVPconfig.style.display = "none";
}

PVPstartBtn.onclick = function(){ 
    pvp = true;
    PVPconfig.style.display = "none";
    let holes  = document.getElementById('pvp_holes').value;
    let seeds = document.getElementById('pvp_n_seeds').value;
    let group = document.getElementById("group").value;
    join(group,nick,pass,holes,seeds);
    startPVP();
}

ltwServerBtn.onclick = function(){
    if(port == ltwServerPort)
        return;
    port = ltwServerPort;
    var ltwServerBtnContainer = document.getElementById("ltw-server-btn-container");
    var ltwServerBtnE = document.getElementById("change-to-ltw-server");
    ltwServerBtnContainer.className =  "navbar__item";
    ltwServerBtnE.className = "navbar-btn";
    var groupServerBtnContainer = document.getElementById("group-server-btn-container");
    var groupServerBtnE = document.getElementById("change-to-group-server");
    groupServerBtnContainer.className = "navbar__btn";
    groupServerBtnE.className = "btn__grad";
    createPopupAlert("Changed to group's server");
}

groupServerBtn.onclick = function(){
    if(port == groupServerPort)
        return;
    port = groupServerPort;
    var ltwServerBtnContainer = document.getElementById("ltw-server-btn-container");
    var ltwServerBtnE = document.getElementById("change-to-ltw-server");
    ltwServerBtnContainer.className = "navbar__btn";
    ltwServerBtnE.className = "btn__grad";
    var groupServerBtnContainer = document.getElementById("group-server-btn-container");
    var groupServerBtnE = document.getElementById("change-to-group-server");
    groupServerBtnContainer.className = "navbar__item";
    groupServerBtnE.className = "navbar-btn";
    createPopupAlert("Changed to group's server");
}



var openLogin = document.getElementById("openLogin");
var loginPopup = document.getElementById("login");
var submitLogin = document.getElementById("submitLogin");
var closeLogin  = document.getElementById("closeLogin");
var loggedNick = document.getElementById("loggedNick");

openLogin.onclick = function(){ 
    loginPopup.style.display = "block";
}

submitLogin.onclick = function(){
    nick = document.getElementById('nick').value;
    pass = document.getElementById('pass').value;
    if(register(nick,pass) != false){
        loginPopup.style.display = "none";
        openLogin.style.display="none";
        loggedNick.innerText = "Logged in as " + nick;
        loggedNick.style.display="block";
    }   
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
    ranking();
    scorePopUp.style.display = "block";
}

closeScore.onclick = function(){ 
    scorePopUp.style.display = "none";
}

//Alert popup
var closeAlert  = document.getElementById("closeAlert");
var alertPopup = document.getElementById("alertPopup");
var alertText = document.getElementById("alertText");

closeAlert.onclick = function(){ 
    alertPopup.style.display = "none";
}

function createPopupAlert(text){
    alertPopup.style.display = "block";
    alertText.innerText = text;
    setTimeout(() => {
        alertPopup.style.display = "none";
    }, 3000);
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

function startPVP(){
    const oldBoard  = document.getElementById('board');
    oldBoard.innerHTML = '';
    pvp = true;

    const holes  = document.getElementById('pvp_holes').value;
    const seeds = document.getElementById('pvp_n_seeds').value;
    game = new Game(seeds, holes, 0, true);
    game.draw();
}

function copyBoard(board){
    let newB = new Board(board.cellCount, 0, true);
    newB.storesSeeds[0] = board.storesSeeds[0];
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
    const res = send(JSON.stringify({ 'group': group, 'nick': nick, 'password': password, 'size': size, 'initial': initial}), 'join');
    if(res != false)
    {
        gameID = res.game;
        console.log("GameID" + gameID);
        let encoded = encodeURI( '?' + 'game=' + gameID + '&nick='+ nick);
        eventSource = new EventSource('http://twserver.alunos.dcc.fc.up.pt:8008/update'+encoded);
        eventSource.onmessage = function(event) {
            const data = JSON.parse(event.data);
            if(data.winner != null){
                createPopupAlert(data.winner + " wins!");
            }
            else if(data.board != null){
                updateBoard(data.board);
                turn = data.board.turn;
                infoTxt.innerText="It's "+ turn + "'s turn.";
            }
            console.log(data);
        }

        let leaveBtn = document.createElement('div');
        leaveBtn.className = "footer_btn_container";
        leaveBtn.innerHTML = '<button class="btn__grad"  id = "leaveBtn" >Leave</button>';
        let footer = document.getElementById('footer');
        footer.appendChild(leaveBtn);
        leaveBtn.onclick = function(){
            infoTxt.innerText = "";
            this.remove();
            leave(nick,pass,gameID);
            eventSource.close()
        }

        infoTxt.innerText="Waiting for opponent";
    }
}

function leave(nick, password, game){
    send(JSON.stringify({ 'nick': nick, 'password': password, 'game':game}), 'leave');

    const oldBoard  = document.getElementById('board');
    oldBoard.innerHTML = '';
}

function ranking(){
    const res = send("{}", 'ranking');
    if(res != false){
        rank = res['ranking'];
        let scores = document.getElementById("scores");
        scores.innerHTML = '<tr class="score-table-header"><th>Nick</th><th>Victories</th><th>Games</th></tr>';

        for(var i = 0; i < rank.length; i++){
            console.log('Entered');
            let tr = document.createElement('tr');
            tr.className = "score-elem";

            let th1 = document.createElement('th');
            th1.innerText = rank[i]['nick']
            tr.appendChild(th1);

            let th2 = document.createElement('th');
            th2.innerText = rank[i]['victories'];            
            tr.appendChild(th2);

            let th3 = document.createElement('th');
            th3.innerText = rank[i]['games'];            
            tr.appendChild(th3);
            scores.appendChild(tr);
        }
    }
}

function register(nick, password){
    let res = send(JSON.stringify({ 'nick': nick, 'password': password}), 'register');
    if (res != false)
    {
        //createPopupAlert("Logged in! Welcome, " + nick);
    }
    return res;
    
}

function notify(nick, password, game, move) {
    return send(JSON.stringify({ 'nick': nick, 'password': password, 'game':game, 'move':move}),'notify');
}

function send(jsonString, route) {
    if(!XMLHttpRequest) { console.log("XHR não é suportado"); return; }
    const xhr = new XMLHttpRequest();

    //xhr.open('POST','http://'+host+':'+port+'/'+route,true);

    xhr.open('POST',host + ":"+ port+"/" +route,false);

    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhr.setRequestHeader("Access-Control-Request-Methods", "POST, GET");
    xhr.setRequestHeader("Sec-Fetch-Site", "cross-site");
    xhr.send(jsonString);

    const res = JSON.parse(xhr.responseText);

    if(xhr.status == 200)
        return res;
    createPopupAlert(res.error);
    return false;
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

function updateBoard(serverBoard){
    game.board.update(serverBoard);
    game.board.draw();
}

class Game{
    constructor(seeds, holes, ai_diff, pvp = false){
        this.board = new Board(holes, seeds);
        this.player = 1;
        this.pvp = pvp;
        this.ai = new AI(this.board, holes, seeds, ai_diff);
    }

    execPlay(r, c){
        let playAgain = false;
        if(pvp){
            if(turn != nick){
                if(turn != "")
                    createPopupAlert("Not your turn!");
                else 
                    createPopupAlert("Waiting for opponent...");
                return;
            }
            if(!notify(nick, pass, gameID, c))
                return;
            
        }
        else{
            //Prevents wrong play
            if(r != this.player)
            return;
            playAgain = this.board.executePlay(r, c);
            
            if(!playAgain && this.player == 1)
            this.player = 0;
            else if (!playAgain)
            this.player = 1;
            
            if(this.checkEnd()){
                if(this.board.storesSeeds[0] > this.board.storesSeeds[1]){
                    createPopupAlert("Game Ended!\n AI wins");
                }
                if(this.board.storesSeeds[0] < this.board.storesSeeds[1]){
                    createPopupAlert("Game Ended!\n You win");
                }
                else if (this.board.storesSeeds[0] == this.board.storesSeeds[1]){
                    createPopupAlert("Game Ended with a draw...");
                }
                return -1;
            }
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
                    if(pvp){
                        //notify(nick, pass, gameID, x);
                        if(playAgain)
                            return;
                    }
                    else{
                        if(playAgain)
                        return;
                        while(game.execPlay(0,game.ai.ai_play())> 0){
                            game.draw();
                        }
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

    update(serverBoard){
        let sides = serverBoard.sides;
        for (const [key, value] of Object.entries(sides)) {
            if(key == nick){
                this.storesSeeds[1] = sides[key].store;
                for(let i = 0; i<this.cellCount; i++)
                {
                    this.cellsSeeds[1][i] = sides[key].pits[i];
                }
            }
            else{
                this.storesSeeds[0] = sides[key].store;
                for(let i = 0; i<this.cellCount; i++)
                {
                    this.cellsSeeds[0][this.cellCount - 1 - i] = sides[key].pits[i];
                }
            }
        }
    }
}
