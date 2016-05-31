"use strict";

var timeoutLength = 120000;
var intervalLength = 60000;

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
            } else {
                clockScreen.style.backgroundColor = 'black';
            }
        }
    };

    req.open('GET', 'waste', true);
    req.send();
}


window.onclick = primeClockScreen;
window.onload = function () {
    primeClockScreen();
    checkWasteDisposal();

    var time = new Date();
    var now_ms = time.getTime();

    time.setHours(24); // after midnight next day

    setTimeout(function () {
        checkWasteDisposal();
        setInterval(checkWasteDisposal, 1000*60*60*24); // 24 hours in ms
    }, time.getTime() - now_ms + 2000);
}
