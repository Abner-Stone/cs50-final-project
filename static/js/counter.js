var seconds = 0;
var el = document.getElementById('counter');

function incrementSeconds() {
    seconds += 1;
    el.innerText = "Time stared at cube: " + seconds + " seconds";
}

var cancel = setInterval(incrementSeconds, 1000);

function saveSeconds() {
    console.log("Saving seconds to database")
    $.ajax({
        url: '/save',
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(seconds)
    })
    console.log("test")
}
