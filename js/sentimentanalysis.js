
const themeToggle = document.getElementById('theme-toggle');

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', initialTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

themeToggle.addEventListener('click', toggleTheme);

initTheme();

//////////////////////////////////////////////////////////////////////////////////////////////////

const homeButton = document.getElementById('home-button');

function returnHome() {
    window.location.href = "index.html";
}

homeButton.addEventListener('click', returnHome);

//////////////////////////////////////////////////////////////////////////////////////////////////

const analyseButton = document.getElementById('analyse-button');
analyseButton.addEventListener('click', analyseText);

async function analyseText() {
    let textInput = document.getElementById("text-input");
    let textString = textInput.value;
    let cleanInput = await prepareInput(textString);
    let result = await predict(cleanInput);

    if (result == 1) {
        document.getElementById("analysis-result").innerHTML = "<h2>Positive</h2>";
    }
    else if (result == 0) {
        document.getElementById("analysis-result").innerHTML = "<h2>Negative</h2>";
    }
    else {
        document.getElementById("analysis-result").innerHTML = "<h2>Neutral</h2>";
    }
}

async function loadTheta() {
    const response = await fetch("assets/theta.json");
    const theta = await response.json();
    return theta;
}

async function loadVocab() {
    const response = await fetch("assets/vocabulary.json");
    const vocabulary = await response.json();
    return vocabulary;
}

async function predict(data) {

    const theta = await loadTheta();
    const log_class_priors = [-0.29998894, -0.30207356];

    let prediction = 2;
    let posCounter = 0;
    let negCounter = 0;
    for (let x = 0; x < 6789; x++) {
        if (data[x] == 1) {
            posCounter += theta[0][x];
            negCounter += theta[1][x];
        }
    }

    if ((posCounter == 0) & (negCounter == 0)) {
        prediction = 2; /*neutral*/
    }
    else if ((log_class_priors[0] + posCounter) > (log_class_priors[1] + negCounter)) {
        prediction = 1; /*positive*/
    }
    else if ((log_class_priors[0] + posCounter) < (log_class_priors[1] + negCounter)) {
        prediction = 0; /*negative*/
    }
    return prediction;
}


async function prepareInput(input) {
    
    const vocabulary = await loadVocab();

    let userInput = input.match(/[\p{L}\p{N}]+/gu) || [];;
    let output = new Array(6789).fill(0);

    let col = 0;
    for (let i = 0; i < 6789; i++) {
        if (userInput.includes(vocabulary[i])) {
            output[col] = 1;
        }
        col++;
    }
    return output;
}

