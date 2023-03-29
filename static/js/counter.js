var el = document.getElementById('counter');
console.log(el.innerText.match(/\d/g))
console.log(parseInt(el.innerText.match(/\d/g)))
var seconds = parseInt(el.innerText.match(/\d/g))

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
    console.log("Seconds: " + JSON.stringify(seconds))
}
