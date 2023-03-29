import os
from datetime import timedelta
import requests
import string
import random
import re
from verify_email import send_email

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

@app.route("/verify", methods=["GET", "POST"])
def verify():
    if request.method == "GET":
        url_code = int(request.args.get("code"))
        try:
            session['code']
        except:
            print("NO CODE")
            return redirect("/")
        
        
        
        if url_code == session['code']:
            print("CODE CURRENT: EMAIL VERIFIED")
            session['email_verified'] = True
            return redirect("/")
        else:
            return redirect("/")

@app.route("/save", methods=["GET", "POST"])
def save():
    if request.method == "POST":
        print(f"SECONDS: {request.get_json()}")
        seconds = request.get_json()
        try:
            session['name']
        except Exception as e:
            print("EXCEPTION OCCURED")
            print("Must be signed in to save score")

        seconds_query="""
            UPDATE acc_info SET seconds = ? WHERE username = ?
        """
        test_query="""SELECT seconds FROM acc_info WHERE username = ?"""
        seconds_data=(seconds, session['name'])
        db = con.cursor()
        db.execute(seconds_query, seconds_data)
        con.commit()
        db.close()

        return redirect("/")
    else:
        return redirect("/")

@app.route("/", methods=["GET", "POST"])
def index():
    try:
        session['name']
    except Exception as e:
        print("CURRENTLY LOGGED OUT")
        return render_template("index.html", picture_data=get_random_string(8), logged_out=True, seconds=0, email_verified=False)
        
    picture_query = """SELECT picture_data FROM acc_info
        WHERE username = ?"""
    picture_data=(session['name'],)
    db = con.cursor()
    picture_data = db.execute(picture_query, picture_data)
        
    session["picture"] = picture_data.fetchone()[0]

    get_seconds_query = """SELECT seconds FROM acc_info WHERE username = ?"""
    res = tuple(map(str, session['name'].split(', ')))
    seconds_query_result = db.execute(get_seconds_query, res)
    seconds = seconds_query_result.fetchone()[0]
    session["checked_seconds"] = 0
    if not seconds:
        session["checked_seconds"] = 0
    else:
        session["checked_seconds"] = seconds

    print(session["checked_seconds"])
    
    try:
        return render_template("index.html", username=session['name'], email=session['email'], picture_data=session["picture"], logged_out=False, seconds=session["checked_seconds"], email_verified=session["email_verified"])
    except:
        return render_template("index.html", username=session['name'], email=session['email'], picture_data=session["picture"], logged_out=False, seconds=session["checked_seconds"], email_verified=False)

@app.route("/login", methods=["GET", "POST"])
def login():

    session.clear()

    username_email = request.form.get("username-email")
    # isUser_Email = 1 // Username
    # isUser_Email = 2 // Email
    isUser_Email = 0

    if request.method == "POST":
        if not username_email:
            print("Must provide username or email while logging in")
            error = 'Must provide username or email while logging in'
            flash(error)
            return render_template("login.html", error=error, picture_data=get_random_string(8), logged_out=True)
        if not request.form.get("password"):
            print("Must provide password while logging in")
            error = 'Must provide password while logging in'
            flash(error)
            return render_template("login.html", erorr=error, picture_data=get_random_string(8), logged_out=True)
        
        pattern = "^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$"
        if not re.search(pattern, username_email):
            print("Input is an username")
            isUser_Email = 1
            username_query = """SELECT username FROM acc_info WHERE username = ?
            """
            db = con.cursor()
            res = tuple(map(str, username_email.split(', ')))
            if not db.execute(username_query, res,).fetchone():
                print("Username does not exist")
                error = 'Username does not exist'
                flash(error)
                db.close
                return render_template("login.html", error=error, picture_data=get_random_string(8), logged_out=True)
            db.close()
        else:
            print("Input is an email")
            isUser_Email = 2
            email_query = """SELECT user_email FROM acc_info WHERE user_email = ?
            """
            db = con.cursor()
            res = tuple(map(str, username_email.split(', ')))
            if not db.execute(email_query, res,).fetchone():
                print("Email does not exist")
                error = 'Email does not exist'
                flash(error)
                db.close()
                return render_template("login.html", error=error, picture_data=get_random_string(8), logged_out=True)
            db.close()

        match isUser_Email:
            case 1:
                password_query = """SELECT pass_hash FROM acc_info WHERE username = ?
                """
            case 2:
                password_query = """SELECT pass_hash FROM acc_info WHERE user_email = ?"""
        db=con.cursor()
        res = tuple(map(str, username_email.split(', ')))
        pass_hash = db.execute(password_query, res)

        if not check_password_hash(pass_hash.fetchone()[0], request.form.get("password")):
            print("Passwords do not match")
            error = 'Passwords do not match'
            flash(error)
            db.close()
            return render_template("login.html", error=error, picture_data=get_random_string(8), logged_out=True)

        match isUser_Email:
            case 1:
                session['name'] = username_email
                login_email_query = """SELECT user_email FROM acc_info WHERE username = ?"""
                db = con.cursor()
                res = tuple(map(str, username_email.split(', ')))
                email = db.execute(login_email_query, res)

                indexed_email = email.fetchone()[0]
                session['email'] = indexed_email
                db.close()
            case 2:
                session['email'] = username_email
                login_username_query = """SELECT username FROM acc_info WHERE user_email = ?"""
                db = con.cursor()
                res = tuple(map(str, username_email.split(', ')))
                username = db.execute(login_username_query, res)

                indexed_username = username.fetchone()[0]
                session['name'] = indexed_username
                db.close()
        return redirect("/")
    else:
        return render_template("login.html", picture_data=get_random_string(8), logged_out=True)


@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")

@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        if (request.get_json() == None):
            db = con.cursor()
            info = {}
            info['name'] = request.form.get("username")
            info['email'] = request.form.get("email")
            info['backup_email'] = request.form.get("backup-email")
            info['picture'] = "https://google.com"
            info['pass_hash'] = request.form.get("password")
            info['confirmation_pass'] = request.form.get("confirmation")
            check_query = """SELECT username, picture_data FROM acc_info
                            WHERE username = ?"""
            check_data = (info['name'],)
            users = db.execute(check_query, check_data)
            result = users.fetchall()

            if len(result) > 0:
                print("Account already exists")
                error = 'Username already exists!'
                flash(error)
                return render_template("signup.html", error=error, picture_data=get_random_string(8), logged_out=True)
            
            if not info['name']:
                print("Must provide Username")
                error = 'Must provide Username!'
                flash(error)
                return render_template("signup.html", error=error, picture_data=get_random_string(8), logged_out=True)
            
            if not info['email']:
                print("Must provide Email")
                error = 'Must provide email!'
                flash(error)
                return render_template("signup.html", error=error, picture_data=get_random_string(8), logged_out=True)
            
            if not info["pass_hash"]:
                print("Must provide password")
                error = 'Must provide password'
                flash(error)
                return render_template("signup.html", error=error, picture_data=get_random_string(8), logged_out=True)
            
            if not info["confirmation_pass"]:
                print("Must provide confirmation password")
                error = 'Must provide confirmation password'
                flash(error)
                return render_template("signup.html", error=error, picture_data=get_random_string(8), logged_out=True)      

            if info["pass_hash"] != info["confirmation_pass"]:
                print("Password must match confirmation password")
                error = 'Password must match confirmation password'
                flash(error)
                return render_template("signup.html", error=error, picture_data=get_random_string(8), logged_out=True)   

            acc_info_query = """INSERT INTO acc_info
                            (username, user_profile, user_email, pass_hash, backup_email, picture_data) 
                            VALUES (?, ?, ?, ?, ?, ?);"""

            data = (info['name'], info['picture'], info['email'], generate_password_hash(info['pass_hash']), info['backup_email'], get_random_string(8))
            db.execute(acc_info_query, data)
            con.commit()
            db.close()
            session['name'] = info['name']
            print(session['name'])
            session['email'] = info['email']
            session['code'] = hash(get_random_string(8))
            print(f"CODE IN APP.PY: {type(session['code'])}")
            send_email(session['name'], session['email'], session['code'])
            return redirect("/")
    else:
        return render_template("signup.html", picture_data=get_random_string(8), logged_out=True)
    
@app.route("/about")
def about():
    return render_template("about.html")

def get_random_string(length):
    # choose from all lowercase letter
    letters = string.ascii_lowercase
    result_str = ''.join(random.choice(letters) for i in range(length))
    print("Random string of length", length, "is:", result_str)
    return result_str

def convertTuple(tup):
        # initialize an empty string
    str = ''
    for item in tup:
        str = str + item
    return str

if __name__ == "__main__":
    app.secret_key = os.urandom(24)
    app.run(debug=True)
