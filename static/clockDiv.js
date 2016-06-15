"use strict";

var timeoutLength =  30000;
var intervalLength = 60000;
var fullDayInMS = 1000*60*60*24;

var timeoutID = -1;
var intervalID = -1;

var clockDisplay = document.getElementById("display");
var clockScreen = document.getElementById("clock-screen");


function padTimeunit(tunit) {
    if (tunit < 10) {
        return "0" + tunit;
    }

    return tunit;
}

function updateClockDisplay() {
    var currentTime = new Date();
    var timeString =
        padTimeunit(currentTime.getHours()) + ":" +
        padTimeunit(currentTime.getMinutes());

    clockDisplay.innerHTML = timeString;
}

function primeClockScreen() {
    clearTimeout(timeoutID);
    clearInterval(intervalID);

    clockScreen.style.zIndex = -1;

    timeoutID = setTimeout(initClockScreen, timeoutLength);
}

function initClockScreen() {
    updateClockDisplay();
    intervalID = setInterval(updateClockDisplay, intervalLength);
    clockScreen.style.zIndex = 1;
}

function checkWasteDisposal() {
    var req = new XMLHttpRequest();

    req.onreadystatechange = function () {
        if(req.readyState == 4 && req.status == 200) {
            var res = JSON.parse(req.responseText);

            if(res.gul_sekk) {
                clockScreen.style.backgroundColor = 'yellow';
            } else if(res.papir) {
                clockScreen.style.backgroundColor = 'blue';
            } else if(res.rest) {
                clockScreen.style.backgroundColor = 'grey';
            }
        }
    };

    req.open('GET', 'waste', true);
    req.send();
}

function enableNightmode() {
    clockScreen.style.backgroundColor = 'black';
    clockDisplay.style.color = 'darkred';
}

function init() {
    primeClockScreen();

    var time = new Date();
    var now_ms = time.getTime();

    // don't display waste disposal info if night
    // schedule night mode if applicable
    if(time.getHours() < 22) {
        if(time.getHours() > 5) {
            checkWasteDisposal();
        }
        time.setHours(22);
        setTimeout(enableNightmode, time.getTime() - now_ms);
    }

    // jump to six in the morning the next day
    time.setDate(time.getDate()+1);
    time.setHours(6);
    time.setMinutes(0);

    // schedule checking of waste disposal info
    setTimeout(function () {
        checkWasteDisposal();
        setInterval(function () {
            checkWasteDisposal();
            clockDisplay.style.color = 'white';
        }, fullDayInMS);
    }, time.getTime() - now_ms);

    // jump to ten in the evening the next day
    time.setHours(22);

    // schedule "night mode", i.e. no bright colours
    setTimeout(function () {
        enableNightmode();
        setInterval(enableNightmode, fullDayInMS);
    }, time.getTime() - now_ms);
}


window.onclick = primeClockScreen;
window.onload = init;
