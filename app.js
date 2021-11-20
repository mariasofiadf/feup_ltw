

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
            let row = document.createElement('tr');
            if(r==0){
                let td = document.createElement('td');
                td.rowSpan = 2;
                row.appendChild(td)
            }
            for(let c = 0; c < holes; c++){
                row.appendChild(document.createElement('td'))
            }
            if(r==0){
                let td = document.createElement('td');
                td.rowSpan = 2;
                row.appendChild(td)
            }
            board.appendChild(row);
        }
    }
}