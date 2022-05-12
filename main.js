//element variables
var aCount;
var buttonDiv
var aButton;
var aUpgradeButton;
var aCost;
var aUpgradeDiv;
//attach element variables to DOM elements
aCount = document.getElementById("aCount");
buttonDiv = document.getElementById("buttonDiv");
aButton = document.getElementById("aButton");
aUpgradeButton = document.getElementById("aUpgradeButton");
aCost = document.getElementById("aCost");
aUpgradeDiv = document.getElementById("aUpgradeDiv");

//letters array
var progress = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

//major variables
const letters = {a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0, n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0};
var increaseAmount = 1;
var currentLetter = 1;
var upgradeCost = 25;
var upgradeMultiplier = 1.15;
var currentLetterIndex = 0;

function buttonClick(letter){
    let UpperLetter = letter.toUpperCase();

    const letterToFind = (isLetter) => isLetter == UpperLetter;

    let indexOfLetter = progress.findIndex(letterToFind);
    letters[letter] += (increaseAmount / (2 ** indexOfLetter));
}

function upgrade(letter){
    if((letters[letter] >= upgradeCost) && currentLetter < 25){
        letters[letter] -= upgradeCost;
        upgradeCost = Math.ceil(upgradeCost * (upgradeMultiplier ** currentLetter));
        aUpgradeButton.innerHTML = "->" + progress[currentLetter + 1];
        let lowerCase = progress[currentLetter].toLowerCase();
        let newUpgrade = "upgrade('" + lowerCase + "')";
        aUpgradeButton.setAttribute("onclick", newUpgrade);
        aCost.innerHTML = upgradeCost + " " + progress[currentLetter];
        addLetterDiv(currentLetter);
        currentLetter++;
        increaseAmount *= 2;
    }
    else if((letters[letter] >= upgradeCost) && currentLetter == 25){
        letters[letter] -= upgradeCost;
        upgradeCost = Math.ceil(upgradeCost * (upgradeMultiplier ** currentLetter));
        addLetterDiv(currentLetter);
        aUpgradeDiv.remove();
        currentLetter++;
        increaseAmount *= 2;
    }
}

function addLetterDiv(index){
    let letterUpper = progress[index];
    let letterLower = letterUpper.toLowerCase();

    let countSpan = document.createElement("span");
    countSpan.id = letterLower + "Count";

    let letterText = document.createTextNode(" " + letterUpper);

    let countH2 = document.createElement("h2");
    countH2.appendChild(countSpan);
    countH2.appendChild(letterText);

    let countButton = document.createElement("button");
    countButton.id = letterLower + "Button";
    countButton.classList.add("countButton");
    let functionName = "buttonClick('" + letterLower + "')";
    countButton.setAttribute("onclick", functionName);
    countButton.appendChild(countH2);

    buttonDiv.appendChild(countButton);
}

window.setInterval(() => {
    aCount.innerHTML = Math.floor(letters.a);
    for(let x = 0; x < progress.length; x++){
        let lowerLetter = progress[x].toLowerCase();
        let letterId = lowerLetter + "Count";
        if(document.getElementById(letterId)){
            let element = document.getElementById(letterId);
            element.innerHTML = Math.floor(letters[lowerLetter]);
        }
    }
}, 10);

window.setInterval(() => {
    for(let x = 0; x < progress.length - 1; x++){
        let lowerLetter = progress[x].toLowerCase();
        let nextLetter = progress[x + 1].toLowerCase();
        letters[lowerLetter] += 1 * letters[nextLetter];
    }
}, 1000);

function cheat(letter, number){
    letters[letter] = number;
}