from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

# Create the extension
db = SQLAlchemy()

# Create the app
app = Flask(__name__)
CORS(app)

# Configure the PostgreSQL database
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:postgres@localhost:5432/project3_db"

# Initialize the app with the extension
db.init_app(app)

# Define the model for the daily_values table
class DailyValue(db.Model):
    __tablename__ = 'daily_values'
    Date = db.Column(db.Date, primary_key=True)
    Value = db.Column(db.Float)

    def __repr__(self):
        return f"<DailyValue(Date='{self.Date}', Value='{self.Value}')>"

@app.route("/")
def home():
    return (
        "<h2>United States COVID-19 Vaccination Tracker</h2>"
        "Available Routes:<br>"
        "&nbsp;&nbsp;/data"
    )

@app.route("/data")
def return_data():
    data = DailyValue.query.all()
    rows = [{'Date': row.Date.strftime('%Y-%m-%d'), 'Value': row.Value} for row in data]
    return jsonify(rows)

if __name__ == "__main__":
    app.run(debug=True)