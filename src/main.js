// importing the sass stylesheet for bundling
import "./../sass/styles.scss";

const SOURCE = "http://localhost:3000/bundle.json";

// -------------------- event handlers
function onResponse(e) {
    console.log(e);
}

function onError(e) {
    console.log(e.message);
}

function main() {
    fetch(SOURCE)
        .then(response => response.json())
        .then(data => onResponse(data))
        .catch(error => {
            onError(error);
            if (debug) throw error;
        });
}

main();