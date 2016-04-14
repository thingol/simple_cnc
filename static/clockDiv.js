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

function reloadIfClockActive() {
    if(clockScreen.style.zIndex == 1) {
        location.reload();
    } else {
        primeClockScreen();
    }
}
    
window.onload = primeClockScreen;
window.onclick = primeClockScreen; //reloadIfClockActive;
