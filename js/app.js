const chess = new Chess();
const piecesClasses = {
    "k": "king",
    "q": "queen",
    "r": "rook",
    "b": "bishop",
    "n": "knight",
    "p": "pawn"
};
const colors = {
    "b": "black",
    "w": "white"
};

var cells;
var selectedPiece = null;
var selectedPieceSquare = null;



$(document).ready(function () {
    $("body").height(window.innerHeight);
    chess.reset();
    renderPosition(chess.board());
    enableBoardEvents();
});

function clearBoard() {
    cells.empty();
}
function renderPosition(position) {
    cells = $(".cell");
    clearBoard();
    for(let row = 0; row < position.length; row++){
        for(let col = 0; col < position[row].length; col++) {
            let piece = position[row][col];
            if (piece !== null) {
                let pieceHTML = document.createElement("div");
                $(pieceHTML).addClass("piece").addClass(piecesClasses[piece.type]).addClass(colors[piece.color]);
                $(cells[8*row + col]).append(pieceHTML);
            }
        }
    }
}

function renderMove(from, to) {
    let cellFrom = $(cells[getCellNumberBySquare(from)]);
    let cellTo = $(cells[getCellNumberBySquare(to)]);
    let piece = $(cellFrom.children()[0]);
    cellTo.empty();
    cellTo.append(piece);
    cellFrom.empty();
}

function enableBoardEvents() {
    cells.on("mouseenter", function (e) {
        let cellIndex = cells.index(e.currentTarget);
        let cellSquare = getCellSquareByNumber(cellIndex);
    });
    cells.on("click", function(e) {
        let cellIndex = cells.index(e.currentTarget);
        let cellSquare = getCellSquareByNumber(cellIndex);

        if (selectedPiece) {
            move(selectedPieceSquare, cellSquare);
        }
    });

    let pieces = $(".piece");
    pieces.on("click", function (e) {
        e.stopPropagation();
        let cellIndex = cells.index($(e.target).parent()[0]);
        let cellSquare = getCellSquareByNumber(cellIndex);
        let possibleMoves = chess.moves({square: cellSquare, verbose: true});
        if (selectedPiece) {
            let pointedPiece = chess.get(cellSquare);
            if (selectedPiece.color !== pointedPiece.color) {
                move(selectedPieceSquare, cellSquare)
            }
        }
        deselectPiece();
        selectPiece(cellSquare);
        showPossibleMoves(possibleMoves.map(x => x.to));
        possibleMoves.map(x => console.log(x));
    });
}

function getCellSquareByNumber(number) {
    let row = String.fromCharCode(97 + number % 8);
    let column = 8 - Math.floor(number / 8);
    return row + column;
}

function getCellNumberBySquare(square) {
    let col = square.charCodeAt(0) - 97;
    let row = square.charCodeAt(1) - 49;
    return (7 - row) * 8 + col;
}

function hidePossibleMoves() {
    $(".possibleMove").remove();
}
function showPossibleMoves(squares) {
    squares.forEach(square => {
        let number = getCellNumberBySquare(square);
        let element = $("<div>", {
            "class": "possibleMove"
        });
        $(cells[number]).append(element);
    })
}

function selectPiece(square) {
    selectedPiece = chess.get(square);
    selectedPieceSquare = square;
}
function deselectPiece(){
    selectedPiece = null;
    selectedPieceSquare = null;
    hidePossibleMoves();
}

function isCastle(move) {
    return (move.san === "O-O") || (move.san === "O-O-O");
}
function renderCastle(move) {
        if (move.to === "g1") {
            renderMove("h1", "f1")
        } else if (move.to === "c1") {
            renderMove("a1", "d1")
        }
        if (move.to === "g8") {
            renderMove("h8", "f8")
        } else if (move.to === "c8") {
            renderMove("a8", "d8")
        }
}
function move(from, to) {
    let move = chess.move({from: from, to: to});
    if (move) {
        renderMove(move.from, move.to);
        if (isCastle(move)) {
            renderCastle(move);
        }
        deselectPiece();
    }
}

