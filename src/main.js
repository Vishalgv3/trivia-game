// importing the sass stylesheet for bundling
import "./../sass/styles.scss";

const SOURCE = "http://localhost:3000/bundle.json";

let jsonData;
let qCategories;
let selectedCategory;
let pageCategories;
let indexBtnStart;
let btnDown;
let btnUp;
let btnSelect;
let questionElement;
let answersElement;
let jsonAnswers;
let pageAnswers;

// -------------------- public methods
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
    console.log(pageCategories);
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
    jsonAnswers = selectedCategory.difficulties.easy[randomEasyIndex].answers;
    jsonAnswers.forEach((answer, i) => {
        let div = document.createElement("div");
        div.classList.add("answer" + i);
        div.classList.add("answer");
        div.innerHTML = answer;
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
}

function onSelectClicked(e) {
    // store the selected category in local storage
    localStorage.setItem("selectedCategory", selectedCategory.innerHTML);
}

function onResponse(data) {
    console.log(data);
    
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
    indexBtnStart = document.querySelector(".indexBtnStart");

    qCategories = document.querySelector("#qCategories");
    btnDown = document.querySelector(".btnDown");
    btnUp = document.querySelector(".btnUp");
    btnSelect = document.querySelector(".btnSelect");

    questionElement = document.querySelector(".question");
    answersElement = document.querySelector(".answers");

    // wire up the event handlers to the buttons
    if (indexBtnStart != null){
        indexBtnStart.focus();
        indexBtnStart.addEventListener("keypress", onIndexBtnStartClicked);
    }

    if (btnDown != null || btnUp != null || btnSelect != null) {
        btnDown.addEventListener("click", onDownClicked);
        btnUp.addEventListener("click", onUpClicked);
        btnSelect.addEventListener("click", onSelectClicked);
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