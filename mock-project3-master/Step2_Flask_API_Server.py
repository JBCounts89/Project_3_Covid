from flask import Flask, jsonify
from flask_cors import CORS, cross_origin
from flask_sqlalchemy import SQLAlchemy
from pprint import pprint

# create the extension
db = SQLAlchemy()

# create the app
app = Flask(__name__)
CORS(app)

# configure the SQLite database, relative to the app instance folder
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:postgres@localhost:5432/project3_db"

# initialize the app with the extension
db.init_app(app)

@app.route("/")
def home():
    return (
        f"<h2>Flask app to return API data</h2>"
        f"Available Routes:<br/>"
        f"&nbsp;&nbsp;/data"
    )


@app.route("/data")
def return_data():
    cursor = db.session.execute("SELECT * FROM daily_values")
    rows = [ row._asdict() for row in cursor.fetchall() ]
    return jsonify(rows)

if __name__ == "__main__":
    app.run(debug=True)
