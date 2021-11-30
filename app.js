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

//Board
function updateBoard(){
    const oldBoard  = document.getElementById('board');
    oldBoard.innerHTML = '';

    const holes  = document.getElementById('holes').value;
    const seeds = document.getElementById('n_seeds').value;
    const newBoard = new Board("board", holes, seeds);
}


class BoardSide{
    

    constructor(id, holes, n_seeds, board){
        this.board = board;
        
    }

    buildStore(){
        this.store = document.createElement('div'); //Store for PLayer1
        store1.className = "store";
        board.appendChild(store1);
        this.store_value = 0;
    }

    buildCells(holes, n_seeds){
        for(let i = 0; i < holes;i++){
            this.cells[i] = n_seeds
        }
    }

}

class Board{
    constructor(id, holes, n_seeds){
        const board  = document.getElementById('board'); 
        
        this.buildStore1(board);


        this.buildStore2(board);
    }

    buildStore1(board){
        this.store1 = document.createElement('div'); //Store for PLayer1
        this.store1.className = "store";
        board.appendChild(this.store1);
        this.store_value1 = 0;
        this.store1.innerHTML = this.store_value1;
    }

    buildStore2(board){
        this.store2 = document.createElement('div'); //Store for PLayer1
        this.store2.className = "store";
        board.appendChild(this.store2);
        this.store_value2 = 0;
        this.store2.innerHTML = this.store_value2;
    }

    buildCells(board){
        const rows = document.createElement('div');//Container for the rows
        rows.className = "rows";
        board.appendChild(rows);

        let row = document.createElement('div');
        row.className = "row";
            
        for(let c = 0; c < holes; c++){
            this.cell1[c] =document.createElement('div');
            this.cell1[c].className = "cell";
            this.cell1[c].innerHTML = n_seeds;
            this.cell1_value[c] = n_seeds
            row.appendChild(this.cell1[c]);
        }
        rows.appendChild(row);

        let row = document.createElement('div');
        row.className = "row";
            
        for(let c = 0; c < holes; c++){
            this.cell2[c] =document.createElement('div');
            this.cell2[c].className = "cell";
            this.cell2[c].innerHTML = n_seeds;
            this.cell2_value[c] = n_seeds
            row.appendChild(cell);

        }

        rows.appendChild(row);
    }
}
