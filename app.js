
var confPopUp = document.getElementById("gameConf");
var openConf = document.getElementById("play");
var closeConf = document.getElementById("closeConf");

openConf.onclick = function(){
    confPopUp.style.display = "block";
}

closeConf.onclick = function(){ 
    confPopUp.style.display = "none";
    startGame();
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
    startGame();
}


function startGame(){
    const oldBoard  = document.getElementById('board');
    oldBoard.innerHTML = '';

    const holes  = document.getElementById('holes').value;
    const seeds = document.getElementById('n_seeds').value;
    game = new Game(seeds, holes);

}


class AI {
    constructor(board, holes, seeds){
        this.board = board;
        this.holes = holes;
    }

    ai_play(){
        let a = Math.random()*this.holes;
        return Math.floor(Math.random() * this.holes);
    }
}

class Game{
    constructor(seeds, holes){
        this.board = new Board("board", holes, seeds);;
        this.player = 1;
        //this.pvp = pvp;
        this.ai = new AI(board, holes,seeds);
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
            console.log("Ended");
            return -1;
        }
        return playAgain;
    }
    

    checkEnd(){
        for(let i = 0; i < this.board.cellCount; i++){
            console.log(parseInt(this.board.cells[this.player][i].innerHTML));
            if (parseInt(this.board.cells[this.player][i].innerHTML) > 0)
                return false;
        }
        return true;
    }
    
    draw(){
        
    }
    
}

class Board{
    constructor(id, holes, n_seeds){
        const boardEl  = document.getElementById('board'); 
        this.turn = 0;
        this.cellCount = holes;
        this.cells = [];
        this.stores = [];
        this.cellsSeeds = [];
        this.storesSeeds = [];
        this.buildStore(boardEl,0);

        this.buildCells(boardEl, holes, n_seeds);

        this.buildStore(boardEl,1);

    }

    buildStore(boardEl, n){
        this.stores[n] = document.createElement('div'); //Store for PLayer1
        this.stores[n].className = "store";
        this.stores[n].innerHTML = 0;
        boardEl.appendChild(this.stores[n]);
    }    

    buildCells(boardEl, holes, n_seeds){
        const rows = document.createElement('div');//Container for the rows
        rows.className = "rows";
        boardEl.appendChild(rows);

        for(let r = 0; r<2; r++){ //Create both rows
            let row = document.createElement('div');
            row.className = "row";
            this.cells.push([])
            for(let c = 0; c < holes; c++){
                this.cells[r][c] = document.createElement('div');
                this.cells[r][c].className = "cell";
                this.cells[r][c].innerHTML = n_seeds;
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
                    };

                    
                }
                row.appendChild(this.cells[r][c]);
            }
            rows.appendChild(row);
        }
    }

    
    executePlay(r, c){
        let seeds = parseInt(this.cells[r][c].innerHTML);
        if(seeds == 0) return 1;
        this.cells[r][c].innerHTML = 0;
        let n;   
        let player = r;

        while(seeds > 0){
            console.log("Stuck!");
            switch(r){
                case 0:
                    c--;
                    if(c >= 0){
                        n = parseInt(this.cells[r][c].innerHTML)
                        this.cells[r][c].innerHTML = n +1;
                        seeds--;
                        if(player == 0 && n == 0 && seeds == 0){
                            let collect = parseInt(this.cells[1][c].innerHTML);
                            this.cells[1][c].innerHTML = 0;
                            let k = parseInt(this.stores[0].innerHTML);
                            this.stores[0].innerHTML = k + collect;
                            return 1;
                        }
                    } else if (player == 0) {
                        r = 1;
                        n = parseInt(this.stores[0].innerHTML)
                        this.stores[0].innerHTML = n + 1;
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
                        n = parseInt(this.cells[r][c].innerHTML)
                        this.cells[r][c].innerHTML = n + 1;
                        seeds--;
                        if(player == 1 && n == 0 && seeds == 0){
                            let collect = parseInt(this.cells[0][c].innerHTML);
                            this.cells[0][c].innerHTML = 0;
                            let k = parseInt(this.stores[1].innerHTML);
                            this.stores[1].innerHTML = k + collect;
                            return 1;
                        }
                    } else if (player == 1){
                        r = 0;
                        n = parseInt(this.stores[1].innerHTML)
                        this.stores[1].innerHTML = n + 1;
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

        
        

    }

}
