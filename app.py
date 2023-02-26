import os
from datetime import timedelta
import requests

from flask import Flask, flash, redirect, render_template, request, session, url_for
from flask_session import Session
from tempfile import mkdtemp
from werkzeug.security import check_password_hash, generate_password_hash

#from authlib.integrations.flask_client import OAuth

import sqlite3

con = sqlite3.connect("users.db", check_same_thread=False)

# Configure application
app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        try:
            a = request.get_json()
            print(a)
        except Exception as e:
            print(e)
            return render_template("index.html", logged_in=0)
        else:
            db = con.cursor()
            info = request.get_json()
            print(info)
            check_query = """SELECT * FROM acc_info
                            WHERE username = ? OR user_profile = ?"""
            check_data = (info['name'], info['picture'])
            db.execute(check_query, check_data)
            if (not check_query):
                acc_info_query = """INSERT INTO acc_info
                                (username, user_profile, user_email, iss) 
                                VALUES (?, ?, ?, ?);"""

                data = (info['name'], info['picture'], info['email'], info['iss'])
                db.execute(acc_info_query, data)
                con.commit()
                db.close()
                return render_template("index.html", profile_url=info['picture'], logged_in=1)
            else:
                print("WARNING: Account already made!")
                return render_template("index.html", profile_url=info['picture'], logged_in=1)
    elif request.method == "GET":
        return render_template("index.html", logged_in=0)

@app.route("/signup")
def signup():
    return render_template('signup.html')
