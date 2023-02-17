from flask import Flask, flash, redirect, render_template, request, session
#from flask_session import Session
from tempfile import mkdtemp
from werkzeug.security import check_password_hash, generate_password_hash

import sqlite3

con = sqlite3.connect("users.db")
db = con.cursor()

# Configure application
app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def index():
    return render_template("index.html")