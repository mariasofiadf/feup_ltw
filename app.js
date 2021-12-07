var confPopUp = document.getElementById("gameConf");
var openConf = document.getElementById("play");
var closeConf = document.getElementById("closeConf");

openConf.onclick = function(){
    confPopUp.style.display = "block";
}

closeConf.onclick = function(){ 
    confPopUp.style.display = "none";
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
var board;
var cells = document.getElementsByClassName("cell");

openScore.onclick = function(){
    scorePopUp.style.display = "block";
}

closeScore.onclick = function(){ 
    scorePopUp.style.display = "none";
    updateBoard();
}

window.onload = function(){
    updateBoard();
}

function play(r,c){
    board.executePlay(r,c);
}

//Board
function updateBoard(){
    const oldBoard  = document.getElementById('board');
    oldBoard.innerHTML = '';

    const holes  = document.getElementById('holes').value;
    const seeds = document.getElementById('n_seeds').value;
    board = new Board("board", holes, seeds);
    cells = document.getElementsByClassName("cell");
    cells.onclick = play();
    //board.executePlay(0, 0);
}


class Board{
    constructor(id, holes, n_seeds){
        const board  = document.getElementById('board'); 
        this.cellCount = holes;
        this.cells = [];
        this.stores = [];
        this.cellsSeeds = [];
        this.storesSeeds = [];
        this.buildStore(board,0);

        this.buildCells(board, holes, n_seeds);

        this.buildStore(board,1);

    }

    buildStore(board, n){
        this.stores[n] = document.createElement('div'); //Store for PLayer1
        this.stores[n].className = "store";
        this.stores[n].innerHTML = 0;
        board.appendChild(this.stores[n]);
    }

    buildCells(board, holes, n_seeds){
        const rows = document.createElement('div');//Container for the rows
        rows.className = "rows";
        board.appendChild(rows);

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
                    let x = parseInt(this.id.charAt(0));
                    let y = parseInt(this.id.charAt(1));
                    play(x,y);
                }
                //this.cells[r][c].addEventListener("click", play);
                row.appendChild(this.cells[r][c]);
            }
            rows.appendChild(row);
        }
    }

    executePlay(r, c){
        let seeds = parseInt(this.cells[r][c].innerHTML);
        this.cells[r][c].innerHTML = 0;
        let n;
        while(seeds > 0){
            switch(r){
                case 0:
                    c--;
                    if(c >= 0){
                        n = parseInt(this.cells[r][c].innerHTML)
                        this.cells[r][c].innerHTML = n +1;
                    } else {
                        r = 1;
                        n = parseInt(this.stores[0].innerHTML)
                        this.stores[0].innerHTML = n + 1;
                    }
                    break;
                case 1:
                    c++;
                    if(c < this.cellCount){
                        n = parseInt(this.cells[r][c].innerHTML)
                        this.cells[r][c].innerHTML = n + 1;
                    } else {
                        r = 0;
                        n = parseInt(this.stores[1].innerHTML)
                        this.stores[1].innerHTML = n + 1;
                    }
                    break;
                default:
                    break;
            }
            seeds--;
        }

    }

}
