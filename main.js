const Gameboard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const updateBoard = (index, symbol) => {
    if (board[index] === "") {
      board[index] = symbol;
      return true;
    }
    return false;
  };

  const resetBoard = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };

  return { getBoard, updateBoard, resetBoard };
})();

const Player = (name, symbol) => {
  let score = 0;
  return { name, symbol, score };
};

const Game = (() => {
  const player1 = Player("Player 1", "X");
  const player2 = Player("Player 2", "O");
  let currentPlayer = player1;
  let isGameActive = false;

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const getCurrentPlayer = () => currentPlayer;

  const setPlayerNames = (name1, name2) => {
    player1.name = name1 || "Player 1";
    player2.name = name2 || "Player 2";
  };

  const checkWinner = () => {
    const board = Gameboard.getBoard();
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const condition of winConditions) {
      const [a, b, c] = condition;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return condition;
      }
    }
    return board.every(cell => cell !== "") ? "tie" : null;
  };

  const updateScore = () => {
    currentPlayer.score += 1;
  };

  const resetGame = () => {
    player1.score = 0;
    player2.score = 0;
    currentPlayer = player1;
    isGameActive = false;
  };

  const startGame = (isActive = true) => {
    isGameActive = isActive;
  };

  const isGameRunning = () => isGameActive;

  return {
    switchPlayer,
    getCurrentPlayer,
    checkWinner,
    updateScore,
    resetGame,
    setPlayerNames,
    startGame,
    isGameRunning,
    player1,
    player2,
  };
})();

const DisplayController = (() => {
  const gameboardDiv = document.getElementById("gameboard");
  const restartBtn = document.getElementById("restart-game");
  const startBtn = document.getElementById("start-game");
  const continueBtn = document.getElementById("continue-game");
  const player1Score = document.getElementById("player1-score");
  const player2Score = document.getElementById("player2-score");
  const player1Input = document.getElementById("player1-name");
  const player2Input = document.getElementById("player2-name");
  const resultDisplay = document.getElementById("result-display");

  const renderBoard = () => {
    const board = Gameboard.getBoard();
    gameboardDiv.innerHTML = "";
    
    gameboardDiv.style.display = "grid";
    gameboardDiv.style.gridTemplateColumns = "repeat(3, 1fr)";
    gameboardDiv.style.gridTemplateRows = "repeat(3, 1fr)";
    gameboardDiv.style.gap = "5px";

    board.forEach((cell, index) => {
      const cellDiv = document.createElement("div");
      cellDiv.classList.add("cell");
      cellDiv.textContent = cell;
      cellDiv.addEventListener("click", () => handleMove(index));
      if (cell) cellDiv.classList.add("taken");
      gameboardDiv.appendChild(cellDiv);
    });
  };

  const handleMove = (index) => {
    if (!Game.isGameRunning()) {
      resultDisplay.textContent = "Press Start Game or Continue to begin!";
      return;
    }

    const currentPlayer = Game.getCurrentPlayer();

    if (Gameboard.updateBoard(index, currentPlayer.symbol)) {
      const winner = Game.checkWinner();

      if (winner) {
        if (winner === "tie") {
          resultDisplay.textContent = "It's a tie!";
        } else {
          resultDisplay.textContent = `${currentPlayer.name} wins!`;
          Game.updateScore();
          updateScores();
        }

        Game.startGame(false); 
        continueBtn.style.display = "block";
      } else {
        Game.switchPlayer();
      }
      renderBoard();
    }
  };

  const updateScores = () => {
    player1Score.textContent = Game.player1.score;
    player2Score.textContent = Game.player2.score;
  };

  startBtn.addEventListener("click", () => {
    Game.setPlayerNames(player1Input.value, player2Input.value);
    Game.startGame();
    resultDisplay.textContent = "";
    Gameboard.resetBoard();
    renderBoard();
  });

  restartBtn.addEventListener("click", () => {
    Game.resetGame();
    Gameboard.resetBoard();
    resultDisplay.textContent = "";
    renderBoard();
    updateScores();
    continueBtn.style.display = "none";
  });

  continueBtn.addEventListener("click", () => {
    Gameboard.resetBoard();
    resultDisplay.textContent = "";
    renderBoard();
    continueBtn.style.display = "none";
    Game.startGame(true);
  });

  

  return { renderBoard };
})();

DisplayController.renderBoard();
