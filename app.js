


window.onload = function() {

    const board = new Board("board");

}

function createBoard(){

}

class Board{
    constructor(id){
        const board  = document.getElementById('board');
        for(let r = 0; r<2; r++){
            let row = document.createElement('tr');
            for(let c = 0; c < 8; c++){
                row.appendChild(document.createElement('td'))
            }
            board.appendChild(row);
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