// importing the sass stylesheet for bundling
import "./../sass/styles.scss";

// importing loading overlay
import "./../node_modules/spin.js/spin.css";
import { Spinner } from "spin.js";

// let spinner = new Spinner({ color: "#FFFFFF", lines:12 }).spin(document.querySelector(".g-loading-overlay"));
let loadingOverlay;

const SOURCE = "http://localhost:3000/bundle.json";

// keys that will be used to play the game
const keyEnter = "Enter";
const keySpace = " ";
const keyA = "a";
const keyB = "b";
const keyC = "c";
const keyD = "d";

// -------------------- global variables
let jsonData;

let indexBtnStart;

let qCategories;
let selectedCategory;
let pageCategories;
let btnSelect;

let timerElement;
let btnStartTimer;
let inputPlayer;
let faceOffWinner;

let questionElement;
let answersElement;
let qTimer;
let qBtnStart;
let qBtnAnswer;
let qInputPlayer;
let qPlayerToAnswer;
let jsonAnswers;
let shuffledAnswers;
let pageAnswers;
let questionNumber;
let correctOrWrong;

let winner;
let winnerScore;
let loser;
let loserScore;
let btnStartAgain;

let player1;
let player2;
let currentPlayer;
let player1Score;
let player2Score;

// -------------------- timer variables
let refreshIntervalId;
let startingMinutes = 0.1;
let time = startingMinutes * 50;

// -------------------- public methods
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
}

function updateTimer() {
    let minutes = Math.floor(time / 50);
    let seconds = time % 50;

    seconds = seconds < 10 ? "0" + seconds : seconds;

    // ON FACE OFF PAGE
    if (timerElement) {
        timerElement.innerHTML = `${minutes}:${seconds}`;
        time--;
    }

    // ON QUESTIONS PAGE
    if (qTimer) {
        qTimer.innerHTML = `${minutes}:${seconds}`;
        time--;
    }

    if (seconds == 0) {
        clearInterval(refreshIntervalId);

        // ON FACE OFF PAGE
        // wire up the event handler for the players
        if (inputPlayer) {
            inputPlayer.focus();
            inputPlayer.placeholder = "Press the button";
            inputPlayer.addEventListener("keypress", onInputPlayerKeyPressed);
        }

        // ON QUESTIONS PAGE
        if (qInputPlayer) {
            qInputPlayer.focus({ preventScroll: true });
            qInputPlayer.placeholder = "Press the button";
            qPlayerToAnswer.innerHTML = "Face Off!!!";
            qInputPlayer.addEventListener("keypress", onQInputPlayerKeyPressed);
        }
    }
}

function questionPageTimerToAnswer() {
    let minutes = Math.floor(time / 50);
    let seconds = time % 50;

    seconds = seconds < 10 ? "0" + seconds : seconds;

    // ON QUESTIONS PAGE
    if (qTimer) {
        qTimer.innerHTML = `${minutes}:${seconds}`;
        time--;
    }

    if (seconds == 0) {
        clearInterval(refreshIntervalId);

        // ON QUESTIONS PAGE
        if (qInputPlayer) {
            qInputPlayer.focus();
            qInputPlayer.placeholder = "Press the button";
            qPlayerToAnswer.innerHTML = "Face Off!!!";
            qInputPlayer.addEventListener("keypress", onQInputPlayerKeyPressed);
        }
    }
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function populateCategories(data) {
    let jsonCategories = data.categories;

    // create the category elements
    jsonCategories.forEach((category, i) => {
        let div = document.createElement("div");
        div.classList.add("category" + i);
        div.classList.add("category");
        div.innerHTML = category.category;

        if (qCategories) qCategories.appendChild(div);
    });

    // select the first category
    selectedCategory = document.querySelector(".category0");
    if (selectedCategory) selectedCategory.classList.add("selected-category");

    // populate the page categories array
    pageCategories = document.querySelectorAll(".category");
}

function populateQuestions(jsonData) {
    let category = localStorage.getItem("selectedCategory");
    console.log(category);

    // find the selected category in the json data
    let selectedCategory = jsonData.categories.find(c => c.category == category);
    console.log(selectedCategory);

    // get a random question from the selected category based on the question number
    let randomIndex;
    let selectedQuestion;
    
    if (questionNumber == 1 || questionNumber == 2) {
        let randomEasyIndex = getRandomNumber(0, selectedCategory.difficulties.easy.length - 1);
        let selectedEasyQuestion = selectedCategory.difficulties.easy[randomEasyIndex];

        randomIndex = randomEasyIndex;
        selectedQuestion = selectedEasyQuestion;
    } else if (questionNumber == 3 || questionNumber == 4) {
        let randomMediumIndex = getRandomNumber(0, selectedCategory.difficulties.medium.length - 1);
        let selectedMediumQuestion = selectedCategory.difficulties.medium[randomMediumIndex];

        randomIndex = randomMediumIndex;
        selectedQuestion = selectedMediumQuestion;
    } else if (questionNumber == 5) {
        let randomHardIndex = getRandomNumber(0, selectedCategory.difficulties.hard.length - 1);
        let selectedHardQuestion = selectedCategory.difficulties.hard[randomHardIndex];

        randomIndex = randomHardIndex;
        selectedQuestion = selectedHardQuestion;
    }

    // populate the question element
    if (questionElement) questionElement.innerHTML = `<span class="${questionNumber}">${questionNumber}</span>. ${selectedQuestion.question}`;

    // populate the answers
    let alphabets = ["A", "B", "C", "D"];
    jsonAnswers = selectedQuestion.answers;
    shuffledAnswers = [...jsonAnswers];
    shuffleArray(shuffledAnswers);
    shuffledAnswers.forEach((answer, i) => {
        let div = document.createElement("div");
        div.classList.add("answer" + alphabets[i]);
        div.classList.add("answer");
        div.innerHTML = `<span class="${alphabets[i]}">${alphabets[i]}</span>. ${answer}`;
        if (answersElement) answersElement.appendChild(div);
    })

    // populate the page answers array
    pageAnswers = document.querySelectorAll(".answer");

    console.log("jsonAnswers >>>> ", jsonAnswers);
    console.log("answer elements >>>> ", pageAnswers);
}

function populateWinnerPage() {
    
    // check the winner
    if (winner == null || winnerScore == null || loser == null || loserScore == null) {
        return;
    } else {
        // get the scores from local storage
        player1Score = localStorage.getItem("player1Score");
        player2Score = localStorage.getItem("player2Score");

        if (player1Score > player2Score) {
            winner.innerHTML = player1;
            winnerScore.innerHTML = player1Score;
            loser.innerHTML = player2;
            loserScore.innerHTML = player2Score;
        } else if (player2Score > player1Score) {
            winner.innerHTML = player2;
            winnerScore.innerHTML = player2Score;
            loser.innerHTML = player1;
            loserScore.innerHTML = player1Score;
        } else {
            winner.innerHTML = "It's a tie!";
            winnerScore.innerHTML = player1Score;
            loser.innerHTML = "It's a tie!";
            loserScore.innerHTML = player2Score;
        }
    }

}

// -------------------- event handlers
function onIndexBtnStartClicked(e) {
    // redirect to the player face off page
    window.location.href = "./pages/faceOff.html";
}

function onInputPlayerKeyPressed(e) {
    // check for keyA
    if (e.key == keyA) {
        // remove the focus so that other keypresses are not captured
        inputPlayer.blur();

        // set the current player
        currentPlayer = player1;
    }

    // check for keyB
    if (e.key == keyB) {
        // remove the focus so that other keypresses are not captured
        inputPlayer.blur();

        // set the current player
        currentPlayer = player2;
    }

    // check if any other key is pressed
    if (e.key != keyA && e.key != keyB) {
        // remove the focus so that other keypresses are not captured
        inputPlayer.blur();

        // set the current player
        currentPlayer = player1;

        // make player1 the current player
        faceOffWinner.innerHTML = `Other keys were pressed, so <span class=\"winner\">${currentPlayer}<\/span> gets to choose the category for simplicity's sake!`;
        faceOffWinner.style.display = "block";

    } else {
        // show the winner
        faceOffWinner.innerHTML = `<span class=\"winner\">${currentPlayer}<\/span> wins the Face Off!!!`;
        faceOffWinner.style.display = "block";
    }


    // store the current player in local storage
    localStorage.setItem("currentPlayer", currentPlayer);

    // redirect to the categories page after 3 seconds
    setTimeout(() => {
        window.location.href = "./categories.html";
    }, 3000);
}

function onQInputPlayerKeyPressed(e) {
    // check for keyA
    if (e.key == keyA) {
        // remove the focus so that other keypresses are not captured
        qInputPlayer.blur();

        // set the current player
        currentPlayer = player1;
    }

    // check for keyB
    if (e.key == keyB) {
        // remove the focus so that other keypresses are not captured
        qInputPlayer.blur();

        // set the current player
        currentPlayer = player2;
    }

    if (e.key != keyA && e.key != keyB) {
        // give the instructions to the players
        qPlayerToAnswer.innerHTML = "Press \"A\" or \"B\" to answer!";

        qInputPlayer.focus();
        qInputPlayer.placeholder = "Press the button";
        qInputPlayer.addEventListener("keypress", onQInputPlayerKeyPressed);
    } else {
        // make sure the options are visible
        qInputPlayer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
        // show the current player
        qInputPlayer.value = `${currentPlayer} answer!`
        qPlayerToAnswer.innerHTML = currentPlayer;
    
        // add event listener to the qBtnAnswer
        setTimeout(() => {
            qBtnAnswer.focus();
            qBtnAnswer.addEventListener("keypress", onAnswerPressed);
        }, 1000);
    
        // reset the timer
        time = 0.3 * 50;
        refreshIntervalId = setInterval(questionPageTimerToAnswer, 1000);
    }

}

function onAnswerPressed(e) {
    // clear the timer
    clearInterval(refreshIntervalId);

    // check for keyA
    if (e.key == keyA) {
        // remove the focus so that other keypresses are not captured
        qBtnAnswer.blur();

        // show the answer
        correctOrWrong.innerHTML = shuffledAnswers[0];
    }

    // check for keyB
    if (e.key == keyB) {
        // remove the focus so that other keypresses are not captured
        qBtnAnswer.blur();

        // show the answer
        correctOrWrong.innerHTML = shuffledAnswers[1];
    }

    // check for keyC
    if (e.key == keyC) {
        // remove the focus so that other keypresses are not captured
        qBtnAnswer.blur();

        // show the answer
        correctOrWrong.innerHTML = shuffledAnswers[2];
    }

    // check for keyD
    if (e.key == keyD) {
        // remove the focus so that other keypresses are not captured
        qBtnAnswer.blur();

        // show the answer
        correctOrWrong.innerHTML = shuffledAnswers[3];
    }

    // check if the answer is correct
    if (correctOrWrong.innerHTML == jsonAnswers[0]) {
        // show the correct answer
        // qBtnAnswer.style.backgroundColor = "green";
        correctOrWrong.style.color = "#b5eeb9";
        correctOrWrong.innerHTML += " is correct!";

        // increase the current player's score according to the question difficulty
        console.log(`Increase this player's score: ${currentPlayer}`);
        console.log(`current question number: ${questionNumber}`);
        if (questionNumber == 1 || questionNumber == 2) {
            if (currentPlayer == player1) player1Score += 10;
            else player2Score += 10;
        } else if (questionNumber == 3 || questionNumber == 4) {
            if (currentPlayer == player1) player1Score += 20;
            else player2Score += 20;
        } else if (questionNumber == 5) {
            if (currentPlayer == player1) player1Score += 30;
            else player2Score += 30;
        }

        console.log(`first player score: ${player1Score}`);
        console.log(`second player score: ${player2Score}`);

    } else {
        // show the wrong answer
        // qBtnAnswer.style.backgroundColor = "red";
        correctOrWrong.style.color = "#ffa3a3";
        correctOrWrong.innerHTML += " is wrong!";
    }

    // continue the game if question number is less than 5
    if (questionNumber < 5) {
        setTimeout(() => {
            // increase the question number
            questionNumber++;
    
            // clear the input and the answer
            qInputPlayer.value = "";
            correctOrWrong.innerHTML = "";
            qTimer.innerHTML = "-:--";
            qPlayerToAnswer.innerHTML = "---";
    
            // clear the answers element
            answersElement.innerHTML = "";

            // focus on the start button
            qBtnStart.focus();

            // // reset the timer
            time = startingMinutes * 50;
            // refreshIntervalId = setInterval(updateTimer, 1000);

            // populate the questions again
            populateQuestions(jsonData);
        }, 4000);
    } else {
        // store the scores in local storage
        localStorage.setItem("player1Score", player1Score);
        localStorage.setItem("player2Score", player2Score);

        // redirect to the winner page
        setTimeout(() => {
            window.location.href = "./winner.html";
        }, 2000);
    }
}

function onDownClicked(e) {
    let categoryBelow = selectedCategory.nextElementSibling;
    
    if (categoryBelow == null) {
        // we are at the bottom of the list
        selectedCategory.classList.remove("selected-category");

        // select the first category
        selectedCategory = pageCategories[0];
        selectedCategory.classList.add("selected-category");

    } else {
        selectedCategory.classList.remove("selected-category");
        categoryBelow.classList.add("selected-category");
        selectedCategory = categoryBelow;
    }

    // make sure the selected category is visible
    selectedCategory.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function onUpClicked(e) {
    let categoryAbove = selectedCategory.previousElementSibling;
    
    if (categoryAbove == null) {
        // we are at the top of the list
        selectedCategory.classList.remove("selected-category");

        // select the last category
        selectedCategory = pageCategories[pageCategories.length - 1];
        selectedCategory.classList.add("selected-category");

    } else {
        selectedCategory.classList.remove("selected-category");
        categoryAbove.classList.add("selected-category");
        selectedCategory = categoryAbove;
    }

    // make sure the selected category is visible
    selectedCategory.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function onSelectClicked(e) {
    // store the selected category in local storage
    localStorage.setItem("selectedCategory", selectedCategory.innerHTML);

    // redirect to the questions page
    window.location.href = "./questions.html";
}

function onResponse(data) {
    jsonData = data;

    // on categories page
    populateCategories(jsonData);
    
    // set question number to 1
    questionNumber = 1;

    // on questions page
    populateQuestions(jsonData);

    // on winner page
    populateWinnerPage();
}

function onError(e) {
    console.log(e.message);
}

// -------------------- main method
function main() {

    // initialization

    // loadingOverlay = document.querySelector(".g-loading-overlay");
    // loadingOverlay.style.display = "none";

    // index page
    indexBtnStart = document.querySelector(".indexBtnStart");
    if (indexBtnStart != null){
        indexBtnStart.focus();
        indexBtnStart.addEventListener("keypress", onIndexBtnStartClicked);
    }

    // face off page
    player1 = "Player 1";
    player2 = "Player 2";

    inputPlayer = document.querySelector(".inputPlayer");
    faceOffWinner = document.querySelector(".faceOffWinner");
    timerElement = document.querySelector(".timer");
    btnStartTimer = document.querySelector(".btnStartTimer");
    if (timerElement != null || btnStartTimer != null) {
        btnStartTimer.focus();
        btnStartTimer.addEventListener("keypress", (e) => {
            btnStartTimer.blur();
            refreshIntervalId = setInterval(updateTimer, 1000);
        });
    }

    // categories page
    qCategories = document.querySelector("#qCategories");
    btnSelect = document.querySelector(".btnSelect");

    if (btnSelect != null) {
        btnSelect.focus();
        btnSelect.addEventListener("keypress", (e) => {
            if (e.key == keyA) {
                // select the category DOWN
                onDownClicked(e);
            } else if (e.key == keyB) {
                // select the category UP
                onUpClicked(e);
            } else if (e.key == keyEnter) {
                // select the category
                onSelectClicked(e);
            }
        });
    }

    // questions page
    player1Score = 0;
    player2Score = 0;

    questionElement = document.querySelector(".question");
    answersElement = document.querySelector(".answers");
    qTimer = document.querySelector(".qTimer");
    qBtnStart = document.querySelector(".qBtnStart");
    qBtnAnswer = document.querySelector(".qBtnAnswer");
    qInputPlayer = document.querySelector(".qInputPlayer");
    qPlayerToAnswer = document.querySelector(".qPlayerToAnswer");
    correctOrWrong = document.querySelector(".correctOrWrong");
    if (qTimer != null || qBtnStart != null) {
        qBtnStart.focus();
        qBtnStart.addEventListener("keypress", (e) => {
            qBtnStart.blur();
            refreshIntervalId = setInterval(updateTimer, 1000);
        });
    }

    // winner page
    winner = document.querySelector(".winner");
    winnerScore = document.querySelector(".winnerScore");
    loser = document.querySelector(".loser");
    loserScore = document.querySelector(".loserScore");
    btnStartAgain = document.querySelector(".btnStartAgain");
    if (btnStartAgain != null) {
        btnStartAgain.focus();
        btnStartAgain.addEventListener("keypress", (e) => {
            // make sure the player score are reset
            localStorage.setItem("player1Score", "");
            localStorage.setItem("player2Score", "");
            window.location.href = "./../index.html";
        });
    }

    // -------------------- fetch data
    fetch(SOURCE)
        .then(response => response.json())
        .then(data => onResponse(data))
        .catch(error => {
            onError(error);
            throw error;
        });
}

main();