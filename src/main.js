// importing the sass stylesheet for bundling
import "./../sass/styles.scss";

const SOURCE = "http://localhost:3000/bundle.json";

let jsonData;
let qCategories;
let selectedCategory;
let pageCategories;
let btnDown;
let btnUp;

// -------------------- public methods
function populateCategories(data) {
    let jsonCategories = data.categories;

    // create the category elements
    jsonCategories.forEach((category, i) => {
        let div = document.createElement("div");
        div.classList.add("category" + i);
        div.classList.add("category");
        div.innerHTML = category.category;

        qCategories.appendChild(div);
    });

    // select the first category
    selectedCategory = document.querySelector(".category0");
    selectedCategory.classList.add("selected-category");

    // populate the page categories array
    pageCategories = document.querySelectorAll(".category");
    console.log(pageCategories);
}

// -------------------- event handlers
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

function onResponse(data) {
    console.log(data);
    
    jsonData = data;
    populateCategories(jsonData);
}

function onError(e) {
    console.log(e.message);
}

// -------------------- main method
function main() {

    // initialization
    qCategories = document.querySelector("#qCategories");
    btnDown = document.querySelector(".btnDown");
    btnUp = document.querySelector(".btnUp");

    // wire up the event handlers to the buttons
    btnDown.addEventListener("click", onDownClicked);
    btnUp.addEventListener("click", onUpClicked);

    // -------------------- fetch data
    fetch(SOURCE)
        .then(response => response.json())
        .then(data => onResponse(data))
        .catch(error => {
            onError(error);
            if (debug) throw error;
        });
}

main();