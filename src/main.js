// importing the sass stylesheet for bundling
import "./../sass/styles.scss";

const SOURCE = "http://localhost:3000/bundle.json";

let jsonData;
let qCategories;

// -------------------- public methods
function populateCategories(data) {

}

// -------------------- event handlers
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