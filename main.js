// generate random number between 0 - length-1
const generateIndex = length => {
    return Math.floor(Math.random() * length);
}
// generate unique sequence of random numbers between 0 and length - 1
const generateUniqueSequence = length => {
    let arr = [];
    while (arr.length < length) {
        let r = generateIndex(length);
        if (arr.indexOf(r) === -1) arr.push(r);
    }

    return arr;
}

// images to display:
let images = [
    'apples.jpg', 'kiwi.png',
    'banana.jpg', 'watermelon.jpg',
    'kiwi.png', 'oranges.jpg',
    'banana.jpg', 'apples.jpg',
    'oranges.jpg', 'watermelon.jpg'
];

let cardFronts = document.getElementsByClassName('card-front');
Array.prototype.forEach.call(cardFronts, (item) => {
    let c = getRandomHexColor();
    item.style.backgroundColor = '#' + c;
})

let imgEls = document.getElementsByClassName('fruit');

function getRandomHexColor() {
    return Math.floor(Math.random() * 16777215).toString(16);
}

function randomizeCards() {
    // generate unique sequencec of indices from 0 to (imgEls.length - 1)
    let idxs = generateUniqueSequence(imgEls.length);

    // go through all img elements and assign random src attribute from images arr
    Array.prototype.forEach.call(imgEls, (item, i) => {
        let idx = idxs[i];
        item.src = `images/${images[idx]}`
    });

}



// start the game
let cardInnerEls = document.getElementsByClassName('card-inner');
let startBtn = document.querySelector('.start');
let tryAgainBtn = document.querySelector('.try-again');
let timerEl = document.querySelector('.timer');
let conditionToStop = false; // set true when all pairs are found
let nrPairs = imgEls.length / 2;
let nrTries = 0;

let startedTimeoutID;
let countDownID;
let countUpID;
const startGame = () => {
    randomizeCards();
    Array.prototype.forEach.call(cardInnerEls, function (item) { item.style.transform = 'rotateY(180deg)' });
    timerEl.textContent = '00:05';
    timerEl.style.color = 'red';
    if (startedTimeoutID !== undefined) {
        clearInterval(startedTimeoutID);
        clearInterval(countDownID);
        clearInterval(countUpID);
    }
    startedTimeoutID = setTimeout(() => {
        Array.prototype.forEach.call(cardInnerEls, function (item) {
            item.style.transform = 'rotateY(0deg)'
        })
    }, 5000)
    countDownFrom(5);

}


// display current minutes and seconds
function displayTime(seconds, minutes) {
    let secondsStr = '';
    let minutesStr = '';

    seconds < 10 ? secondsStr = `0${seconds}` : secondsStr = '' + seconds;
    minutes < 10 ? minutesStr = `0${minutes}` : minutesStr = '' + minutes;

    timerEl.textContent = `${minutesStr}:${secondsStr}`
}


// count up till conditionToStop
function countUp() {
    let seconds = 0;
    let minutes = 0;

    countUpID = setInterval(() => {
        seconds++;
        minutes = Math.floor((seconds - seconds % 60) / 60);
        displayTime(seconds % 60, minutes);
        if (conditionToStop) {
            clearInterval(countUpID);
            nrTries++;
            let div = document.createElement('div');
            div.textContent = `${nrTries}. ` + timerEl.textContent;

            div.style.width = '100%';
            div.style.height = '50px';
            div.style.padding = '5px';
            div.style.textAlign = 'center';
            div.style.display = 'flex';
            div.style.alignItems = 'center';
            div.style.justifyContent = 'center';
            nrTries % 2 === 0 ? div.style.backgroundColor = '#d1d1d1' : div.style.backgroundColor = 'transparent'

            document.querySelector('.scoreboard').appendChild(div);
        }
    }, 1000)
}

function countDownFrom(seconds) {
    countDownID = setInterval(() => {
        seconds--;
        displayTime(seconds, 0);

        if (seconds === 0) {
            clearInterval(countDownID);
            timerEl.textContent = '00:00';
            countUp();
            timerEl.style.color = 'green';
        }
    }, 1000)
}


startBtn.addEventListener('click', startGame);
tryAgainBtn.addEventListener('click', handleTryAgain);

function handleTryAgain() {

    conditionToStop = false;
    nrPairs = imgEls.length / 2;
    randomizeCards();
    startGame();
}

Array.prototype.forEach.call(cardInnerEls, (item) => {
    item.addEventListener('click', handleCardItemClick);
});

let elQueue = [];
function handleCardItemClick(evt) {
    console.log(evt.target.parentNode)
    let fruit = evt.target.nextSibling
        .nextSibling
        .childNodes[1]
        .src
        .split('images/')[1]
        .split('.')[0];
    if (elQueue.length === 0) {
        elQueue.push({ fruit, parent: evt.target.parentNode });
    }
    else {
        let isMatch;
        if (elQueue[0].parent === evt.target.parentNode)
            return;
        elQueue[0].fruit === fruit ? isMatch = true : isMatch = false;

        if (isMatch) {
            elQueue[0].parent.style.transform = 'rotateY(180deg)';
            evt.target.parentNode.style.transform = 'rotateY(180deg)';
            nrPairs--;
        }
        elQueue.length = 0;

        if (nrPairs === 0) {
            conditionToStop = true;

        }
    }

}



