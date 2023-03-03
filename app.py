import os
from datetime import timedelta
import requests
import string
import random

from flask import Flask, flash, redirect, render_template, request, session, url_for
from flask_session import Session
from tempfile import mkdtemp
from werkzeug.security import check_password_hash, generate_password_hash

try: 
  import simplejson as json
except:
  import json

import sqlite3

con = sqlite3.connect("users.db", check_same_thread=False, timeout=30)

# Configure application
app = Flask(__name__)
app.secret_key = os.urandom(24)

@app.route("/", methods=["GET", "POST"])
def index():
    try:
        session['name']
    except Exception as e:
        print("CURRENTLY LOGGED OUT")
        return render_template("index.html", picture_data=get_random_string(8), logged_out=True)
    
    picture_query = """SELECT picture_data FROM acc_info
        WHERE username = ?"""
    picture_data=(session['name'],)
    db = con.cursor()
    picture_data = db.execute(picture_query, picture_data)
    
    picture = picture_data.fetchone()[0]
    print(picture)
    
    return render_template("index.html", username=session['name'], email=session['email'], picture_data=picture, logged_out=False)

@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")

@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        print("POST REQUEST RECEIVED")
        if (request.get_json() == None):
            db = con.cursor()
            info = {}
            info['name'] = request.form.get("username")
            info['email'] = request.form.get("email")
            info['backup_email'] = request.form.get("backup-email")
            info['picture'] = "https://google.com"
            info['pass_hash'] = request.form.get("password")
            check_query = """SELECT username, picture_data FROM acc_info
                            WHERE username = ?"""
            check_data = (info['name'],)
            users = db.execute(check_query, check_data)
            result = users.fetchall()

            if len(result) > 0:
                print("Account already exists")
                return render_template("signup.html", error="Username already exists")

            acc_info_query = """INSERT INTO acc_info
                            (username, user_profile, user_email, pass_hash, backup_email, picture_data) 
                            VALUES (?, ?, ?, ?, ?, ?);"""

            data = (info['name'], info['picture'], info['email'], generate_password_hash(info['pass_hash']), info['backup_email'], get_random_string(8))
            db.execute(acc_info_query, data)
            con.commit()
            db.close()
            session['name'] = info['name']
            session['email'] = info['email']
            return redirect("/")
    else:
        return render_template("signup.html", picture_data=get_random_string(8), logged_out=True)

def get_random_string(length):
    # choose from all lowercase letter
    letters = string.ascii_lowercase
    result_str = ''.join(random.choice(letters) for i in range(length))
    print("Random string of length", length, "is:", result_str)
    return result_str

if __name__ == "__main__":
    app.secret_key = os.urandom(24)
    app.run(debug=True)
