var seconds = 0;
var el = document.getElementById('counter');

function incrementSeconds() {
    seconds += 1;
    el.innerText = "Time stared at cube: " + seconds;
}

var cancel = setInterval(incrementSeconds, 1000);