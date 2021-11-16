

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

}