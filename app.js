


window.onload = function() {

}

function updateBoard(){

    const oldBoard  = document.getElementById('board');
    oldBoard.innerHTML = '';

    const holes  = document.getElementById('holes').value;
    const newBoard = new Board("board", holes);
}

class Board{
    constructor(id, holes){
        const board  = document.getElementById('board');
        for(let r = 0; r<2; r++){
            let row = document.createElement('tr', id="board_row");
            let td = document.createElement('td', id ="board_data");
            if(r==0){
                td.rowSpan = 2;
                row.appendChild(td);
            }
            for(let c = 0; c < holes; c++){
                row.appendChild(document.createElement('td'));
            }
            if(r==0){
                td.rowSpan = 2;
                row.appendChild(td);
            }
            board.appendChild(row);
        }
    }
}

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

}