// importing the sass stylesheet for bundling
import "./../sass/styles.scss";

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
let jsonAnswers;
let pageAnswers;

let player1;
let player2;
let currentPlayer;

// -------------------- timer variables
let refreshIntervalId;
let startingMinutes = 0.1;
let time = startingMinutes * 60;

// -------------------- public methods
function updateTimer() {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    seconds = seconds < 10 ? "0" + seconds : seconds;

    // ON FACE OFF PAGE
    if (timerElement) timerElement.innerHTML = `${minutes}:${seconds}`;
    time--;

    // ON QUESTIONS PAGE

    if (seconds == 0) {
        clearInterval(refreshIntervalId);

        // ON FACE OFF PAGE
        // wire up the event handler for the players
        inputPlayer.focus();
        inputPlayer.placeholder = "Press the button";
        inputPlayer.addEventListener("keypress", onInputPlayerKeyPressed);
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

    // get a random question from the selected category
    let randomEasyIndex = getRandomNumber(0, selectedCategory.difficulties.easy.length - 1);
    let selectedEasyQuestion = selectedCategory.difficulties.easy[randomEasyIndex];

    // populate the question element
    if (questionElement) questionElement.innerHTML = selectedEasyQuestion.question;

    // populate the answers
    let alphabets = ["A", "B", "C", "D"];
    jsonAnswers = selectedCategory.difficulties.easy[randomEasyIndex].answers;
    jsonAnswers.forEach((answer, i) => {
        let div = document.createElement("div");
        div.classList.add("answer" + alphabets[i]);
        div.classList.add("answer");
        div.innerHTML = `<span class="${alphabets[i]}">${alphabets[i]}</span>. ${answer}`;
        if (answersElement) answersElement.appendChild(div);
    })

    // populate the page answers array
    pageAnswers = document.querySelectorAll(".answer");

    console.log("jsonAnswers>>>> ", jsonAnswers);
    console.log("answer elements >>>> ", pageAnswers);
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

    // show the winner
    faceOffWinner.innerHTML = `${currentPlayer} wins the Face Off!!!`;
    faceOffWinner.style.display = "block";

    // store the current player in local storage
    localStorage.setItem("currentPlayer", currentPlayer);

    // redirect to the categories page after 3 seconds
    setTimeout(() => {
        window.location.href = "./categories.html";
    }, 3000);
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

    // on questions page
    populateQuestions(jsonData);
}

function onError(e) {
    console.log(e.message);
}

// -------------------- main method
function main() {

    // initialization

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
    questionElement = document.querySelector(".question");
    answersElement = document.querySelector(".answers");

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