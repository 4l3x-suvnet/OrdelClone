const numberOfGuesses = 6;
let currentGuess = 0;
let chosenWord;
let word = "";
let gameIsActive = true;

let guessedWords = JSON.parse(localStorage.getItem("guesses"));
if (!guessedWords) {
  guessedWords = [];
}

function gameLoop() {
  if (gameIsActive) {
    chosenWord = getRandomWord();
    console.log("The correct word is: " + chosenWord);
    checkInput();
    gameState(gameIsActive);
  }
}

function gameState(gameIsActive) {
  return gameIsActive;
}

function getRandomWord() {
  const randomNumber = Math.floor(Math.random() * words.length);
  return words[randomNumber];
}

if (gameState) {
  document.addEventListener("keydown", keyPressed);
  function keyPressed(e) {
    const character = e.key;
    if (keys.includes(character)) buildWord(character);
    if ((word.length == 5 && character == " ") || character == "Enter")
      checkAnswer();
    if (word.length > 0 && character == "Backspace") backspaceKey();
  }

  document.addEventListener("click", (e) => {
    const backspaceIcon = document.querySelector(".backspace-i");
    const backspaceIconTwo = document.querySelector(".backspace-x");
    const backspace = document.querySelector(".backspace");
    const backspaceSplit = document.querySelector(".split-backspace");
    const character = e.target.innerHTML;
    const clickedCharacter = e.target;
    const backspaceDivs = [];
    backspaceDivs.push(
      backspaceIcon,
      backspaceIconTwo,
      backspace,
      backspaceSplit
    );

    const play = document.querySelector(".play");

    if (keys.includes(character)) buildWord(character);

    if (backspaceDivs.includes(clickedCharacter) && word.length > 0)
      backspaceKey();

    if (clickedCharacter === play && word.length == 5) checkAnswer();
  });
}

function buildWord(character) {
  if (word.length != 5 && gameIsActive) {
    word += character;

    checkInput();
  }
}

function backspaceKey() {
  if (gameIsActive) {
    const grid = document.querySelector(".grid");
    let currentTile;
    for (let i = 0; i < word.length; i++) {
      currentTile = grid.children[currentGuess * 5 + i];
    }
    currentTile.classList.remove("input");
    currentTile.firstChild.remove();

    let editedWord = word.slice(0, -1);
    word = editedWord;
    updateGame(currentTile);
  }
}

function checkWordExists() {
  if (words.includes(word)) return true;
  else return false;
}

function checkAnswer() {
  if (!checkWordExists()) {
    for (let index = 0; index < word.length; index++) {
      const grid = document.querySelector(".grid");
      const selectedTile = grid.children[currentGuess * 5 + index];
      setTimeout(() => {
        selectedTile.classList.add("faulty");
      }, 10 * index);
      setTimeout(() => {
        selectedTile.classList.remove("faulty");
      }, 500);
    }
    alertWordDoesNotExist();
  }
  if (gameIsActive && checkWordExists()) {
    checkRightWord();

    addGuess();

    setTimeout(() => {
      if (chosenWord === word) {
        winningAnimation();
        endGame();
      } else wrongAnswer();
    }, 2500);
  }
}

function winningAnimation() {
  for (let index = 0; index < word.length; index++) {
    const grid = document.querySelector(".grid");
    const selectedTile = grid.children[(currentGuess - 1) * 5 + index];
    setTimeout(() => {
      selectedTile.classList.add("jumpy");
    }, 50 * index);
  }
}

function addGuess() {
  const guess = {
    word,
    currentGuess,
  };

  guessedWords.push(guess);
  currentGuess++;
  window.localStorage.setItem("guesses", JSON.stringify(guessedWords));
  // renderAllGuesses();
}

function endGame() {
  gameIsActive = false;
  setTimeout(() => {
    openForm();
    endGameStyling();
  }, 3000);
}

function endGameStyling() {
  const keyboard = document.getElementsByClassName("keys");
  for (let i = 0; i < keyboard.length; i++) {
    for (let y = 0; y < keyboard[i].children.length; y++) {
      if (
        !keyboard[i].children[y].classList.contains("right") &&
        !keyboard[i].children[y].classList.contains("kinda") &&
        !keyboard[i].children[y].classList.contains("wrong")
      )
        keyboard[i].children[y].style.color = "transparent";
    }

    const backspace = document.getElementsByClassName("fa-backspace");
    for (let index = 0; index < backspace.length; index++) {
      backspace[index].style.color = "transparent";
    }
  }
}

function wrongAnswer() {
  if (currentGuess < numberOfGuesses) {
    word = "";
    const grid = document.querySelector(".grid");
    const startChild = grid.children[currentGuess * 5];
    updateGame(startChild);
  } else endGame();
}

function checkRightWord() {
  let remainingLetters = chosenWord;

  for (let i = 0; i < word.length; i++) {
    if (word[i] === chosenWord[i]) {
      remainingLetters = remainingLetters.replace(word[i], "");
      renderAnswer(word[i], i, "right");
    } else if (!chosenWord.includes(word[i])) {
      renderAnswer(word[i], i, "wrong");
    }
  }

  for (let i = 0; i < word.length; i++) {
    if (remainingLetters.includes(word[i]) && word[i] !== chosenWord[i]) {
      remainingLetters = remainingLetters.replace(word[i], "");
      renderAnswer(word[i], i, "kinda");
    }
  }
}

function updateGame(tile) {
  setCursor(tile);
  renderAllGuesses();
}

function renderAnswer(character, index, classname) {
  const grid = document.querySelector(".grid");
  const selectedTile = grid.children[currentGuess * 5 + index];
  setTimeout(() => {
    selectedTile.classList.add(classname, "flip");
  }, 400 * index);

  const keyboard = document.getElementsByClassName("keys");

  for (let i = 0; i < keyboard.length; i++) {
    for (let y = 0; y < keyboard[i].children.length; y++) {
      console.log(keyboard[i].children[y]);
      if (
        character === keyboard[i].children[y].getAttribute("data-char") &&
        !keyboard[i].children[y].classList.contains("right")
      ) {
        setTimeout(() => {
          keyboard[i].children[y].className = classname;
          keyboard[i].children[y].classList.add("flip");
        }, 400 * index);
      }
    }
  }
}

function renderAllGuesses() {
  const allGuesses = document.querySelectorAll("grid");
}
