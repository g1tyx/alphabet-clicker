//element variables
var aCount;
var buttonDiv
var aButton;
var aButtonDefault;
var aUpgradeButton;
var aCost;
var aUpgradeDiv;
var prestigeDiv;
var aPrestigeCost;
var prestigeCountText;
var aMetaprestigeCost;
var metaprestigeCountText;
//attach element variables to DOM elements
aCount = document.getElementById("aCount");
buttonDiv = document.getElementById("buttonDiv");
aButtonDefault = document.getElementById("aButton");
aButton = document.getElementById("aButton");
aUpgradeButton = document.getElementById("aUpgradeButton");
aCost = document.getElementById("aCost");
aUpgradeDiv = document.getElementById("aUpgradeDiv");
prestigeDiv = document.getElementById("prestigeDiv");
aPrestigeCost = document.getElementById("aPrestigeCost");
prestigeCountText = document.getElementById("prestigeCountText");
aMetaprestigeCost = document.getElementById("aMetaprestigeCost");
metaprestigeCountText = document.getElementById("metaprestigeCountText");

//letters array
var progress = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

var userData = {};
//load userdata if available
if(localStorage.getItem("gameStateData") === null){
    //create new user data
    userData = {
        letters: {a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0, n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0},
        increaseAmount: 1,
        currentLetter: 1,
        upgradeCost: 25,
        prestigeCost: 5000000,
        prestigeLevel: 1,
        metaPrestigeCost: 6,
        metaPrestigeLevel: 1
    }
}
else{
    //load saved user data
    userData = JSON.parse(window.localStorage["gameStateData"]);
    //push current upgrades
    let temporaryLetter = userData.currentLetter;
    userData.currentLetter = 1;
    pushUpgrade(temporaryLetter - 1);
    userData.currentLetter = temporaryLetter;

    //update prestige cost
    aPrestigeCost.innerHTML = userData.prestigeCost + " A";
    aMetaprestigeCost.innerHTML = userData.metaPrestigeCost + " Prestige";
}

//global variables
var upgradeMultiplier = 1.15;
var prestigeMultiplier = 5;
var metaprestigeMultiplier = 1.25;

function buttonClick(letter){
    let UpperLetter = letter.toUpperCase();

    const letterToFind = (isLetter) => isLetter == UpperLetter;

    let indexOfLetter = progress.findIndex(letterToFind);
    userData.letters[letter] += ((userData.increaseAmount / (2 ** indexOfLetter)) * (userData.prestigeLevel ** userData.metaPrestigeLevel));
}

function upgrade(letter){
    if((userData.letters[letter] >= userData.upgradeCost) && userData.currentLetter < 25){
        userData.letters[letter] -= userData.upgradeCost;
        userData.upgradeCost = Math.ceil((userData.upgradeCost * (upgradeMultiplier ** userData.currentLetter)) / userData.metaPrestigeLevel);
        aUpgradeButton.innerHTML = "->" + progress[userData.currentLetter + 1];
        let lowerCase = progress[userData.currentLetter].toLowerCase();
        let newUpgrade = "upgrade('" + lowerCase + "')";
        aUpgradeButton.setAttribute("onclick", newUpgrade);
        aCost.innerHTML = userData.upgradeCost + " " + progress[userData.currentLetter];
        addLetterDiv(userData.currentLetter);
        userData.currentLetter++;
        userData.increaseAmount *= 2;
    }
    else if((userData.letters[letter] >= userData.upgradeCost) && userData.currentLetter == 25){
        userData.letters[letter] -= userData.upgradeCost;
        userData.upgradeCost = Math.ceil(userData.upgradeCost * (upgradeMultiplier ** userData.currentLetter));
        addLetterDiv(userData.currentLetter);
        aUpgradeDiv.remove();
        userData.currentLetter++;
        userData.increaseAmount *= 2;
    }
}

function pushUpgrade(number){
    for(let x = 0; x < number; x++){
        aUpgradeButton.innerHTML = "->" + progress[userData.currentLetter + 1];
        let lowerCase = progress[userData.currentLetter].toLowerCase();
        let newUpgrade = "upgrade('" + lowerCase + "')";
        aUpgradeButton.setAttribute("onclick", newUpgrade);
        aCost.innerHTML = userData.upgradeCost + " " + progress[userData.currentLetter];
        addLetterDiv(userData.currentLetter);
        userData.currentLetter++;
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

function prestige(){
    if(userData.letters.a >= userData.prestigeCost){
        userData.increaseAmount = 1;
        userData.currentLetter = 1;
        userData.upgradeCost = 25;
        userData.prestigeLevel++;
        buttonDiv.innerHTML = "";
        buttonDiv.appendChild(aButtonDefault);
        Object.keys(userData.letters).forEach(prop => userData.letters[prop] = 0);
        let lowerCase = progress[0].toLowerCase();
        let newUpgrade = "upgrade('" + lowerCase + "')";
        aUpgradeButton.setAttribute("onclick", newUpgrade);
        aUpgradeButton.innerHTML = "->" + progress[1];
        aCost.innerHTML = userData.upgradeCost + " " + progress[0];
        userData.prestigeCost = Math.ceil((userData.prestigeCost * (prestigeMultiplier ** userData.prestigeLevel)) / userData.metaPrestigeLevel);
        aPrestigeCost.innerHTML = userData.prestigeCost + " A";
    }
    //cannot afford
}

function metaprestige(){
    if(userData.prestigeLevel >= userData.metaPrestigeCost){
        userData.increaseAmount = 1;
        userData.currentLetter = 1;
        userData.upgradeCost = 25;
        userData.prestigeLevel = 1;
        userData.prestigeCost = 5000000;
        userData.metaPrestigeLevel++;
        buttonDiv.innerHTML = "";
        buttonDiv.appendChild(aButtonDefault);
        Object.keys(userData.letters).forEach(prop => userData.letters[prop] = 0);
        userData.upgradeCost = Math.ceil((userData.upgradeCost * (upgradeMultiplier ** userData.currentLetter)) / userData.metaPrestigeLevel);
        let lowerCase = progress[0].toLowerCase();
        let newUpgrade = "upgrade('" + lowerCase + "')";
        aUpgradeButton.setAttribute("onclick", newUpgrade);
        aUpgradeButton.innerHTML = "->" + progress[1];
        aCost.innerHTML = userData.upgradeCost + " " + progress[0];
        aPrestigeCost.innerHTML = userData.prestigeCost + " A";
        userData.metaPrestigeCost = Math.ceil((userData.metaPrestigeCost * (metaprestigeMultiplier ** userData.metaPrestigeLevel)));
        aMetaprestigeCost.innerHTML = userData.metaPrestigeCost + " Prestige";
    }
}

window.setInterval(() => {
    aCount.innerHTML = Math.floor(userData.letters.a);
    for(let x = 0; x < progress.length; x++){
        let lowerLetter = progress[x].toLowerCase();
        let letterId = lowerLetter + "Count";
        if(document.getElementById(letterId)){
            let element = document.getElementById(letterId);
            element.innerHTML = Math.floor(userData.letters[lowerLetter]);
        }
    }
    prestigeCountText.innerHTML = userData.prestigeLevel - 1;
    metaprestigeCountText.innerHTML = userData.metaPrestigeLevel - 1;
}, 10);

window.setInterval(() => {
    for(let x = 0; x < progress.length - 1; x++){
        let lowerLetter = progress[x].toLowerCase();
        let nextLetter = progress[x + 1].toLowerCase();
        userData.letters[lowerLetter] += userData.prestigeLevel * userData.letters[nextLetter];
    }

    save();
}, 1000);

function cheat(letter, number){
    userData.letters[letter] = number;
}

function save(){
    userData = {
        letters: userData.letters,
        increaseAmount: userData.increaseAmount,
        currentLetter: userData.currentLetter,
        upgradeCost: userData.upgradeCost,
        prestigeCost: userData.prestigeCost,
        prestigeLevel: userData.prestigeLevel,
        metaPrestigeCost: userData.metaPrestigeCost,
        metaPrestigeLevel: userData.metaPrestigeLevel
    }
    localStorage.setItem("gameStateData", JSON.stringify(userData));
}

function reset(){
    //reset saved user data to default and reload page
    userData = {
        letters: {a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0, n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0},
        increaseAmount: 1,
        currentLetter: 1,
        upgradeCost: 25,
        prestigeCost: 5000000,
        prestigeLevel: 1,
        metaPrestigeCost: 6,
        metaPrestigeLevel: 1
    }
    localStorage.setItem("gameStateData", JSON.stringify(userData));
    location.reload();
}
