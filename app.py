from flask import Flask, render_template
import requests

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def index():
    try:
        url = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=J90zoEXSKtur9mdOyoVPX6wlinWUjo14"
        response = requests.get(url)
        response.raise_for_status()
    except requests.RequestException:
        return None
    
    try:
        data = response.json()
        events = data["_embedded"]["events"]
        print(f"AMOUNT OF EVENTS: {len(events)}")
        names = []
        for i in range(len(events)):
            names.append(events[i]['name'])
            print(events[i]['name'])
    except (KeyError, TypeError, ValueError):
        return None

    return render_template("index.html", events=events, length=len(events), names=names)