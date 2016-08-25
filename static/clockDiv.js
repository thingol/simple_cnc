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
    debugger;
    clockScreen.style.backgroundColor = 'black';
    clockDisplay.style.color = 'darkred';
}

function enableDaymode() {
    checkWasteDisposal();
    clockDisplay.style.color = 'white';

}

function scheduleDayNightModes() {
    var time = new Date();
    var now_ms = time.getTime();

    var schedule = function (func, time) {
        //console.log('scheduling\n' + func);
        setTimeout(function () {
            func();
            setInterval(func, fullDayInMS);
        }, time - now_ms);
    };

    var printTimeDebug = function () {
        console.log('now_ms = ' + now_ms);
        console.log('timeout = ' + time);
        console.log('timeout = ' + time.getTime());
        console.log('timeout = ' + ((time.getTime() - now_ms)) / 1000 / 60 / 60);
    };

    time.setMinutes(0);

    if(time.getHours() < 6) {
        // begge i dag
        console.log('før 6');

        time.setHours(6);
        printTimeDebug();
        schedule(enableDaymode, time.getTime());

        time.setHours(22);
        printTimeDebug();
        schedule(enableNightmode, time.getTime());
    }
    else if(time.getHours() > 5) {
        // day mode i morgen
        // night mode i dag
        //console.log('mellom 6 og 22');

        time.setHours(22);
        //printTimeDebug();
        schedule(enableNightmode, time.getTime());

        time.setDate(time.getDate()+1);
        time.setHours(6);
        //printTimeDebug();
        schedule(enableDaymode, time.getTime());

    }
    else {
        // begge i morgen
        //console.log('etter 22');
        time.setDate(time.getDate()+1);
        time.setHours(6);
        //printTimeDebug();
        schedule(enableDaymode, time.getTime());

        time.setHours(22);
        //printTimeDebug();
        schedule(enableNightmode, time.getTime());
    }
};

function init() {
    primeClockScreen();

    var hours = new Date().getHours();

    if (hours > 21 || hours < 6) {
        console.log('det er natt!');
        enableNightmode();
    } else {
        enableDaymode();
    }

    scheduleDayNightModes();
};


window.onclick = primeClockScreen;
window.onload = init;
