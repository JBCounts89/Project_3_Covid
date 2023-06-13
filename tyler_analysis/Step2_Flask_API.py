from flask import Flask, jsonify, request
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
    row_number = db.Column(db.Float, primary_key=True)
    date = db.Column(db.Date)
    total_vaccinations = db.Column(db.Float)
    daily_vaccinations = db.Column(db.Float)
    people_vaccinated_per_hundred = db.Column(db.Float)
    location = db.Column(db.String)

    def __repr__(self):
        return f"<DailyValue(date='{self.date}', total_vaccinations='{self.total_vaccinations}')>"

@app.route("/")
def home():
    return (
        "<h2>United States COVID-19 Vaccination Tracker</h2>"
        "Available Routes:<br>"
        "&nbsp;&nbsp;/data"
    )

@app.route("/data")
def return_data():
    start_date = request.args.get('start')  # Get the start parameter from the request
    end_date = request.args.get('end')  # Get the end parameter from the request

    # Filter the data based on the provided date range
    query = DailyValue.query
    if start_date:
        query = query.filter(DailyValue.date >= start_date)
    if end_date:
        query = query.filter(DailyValue.date <= end_date)

    data = query.all()

    rows = [
        {
            'Date': row.date,
            'Total Vaccinations': row.total_vaccinations,
            'Daily Vaccinations': row.daily_vaccinations,
            'Vaccination Rate': row.people_vaccinated_per_hundred,
            'State': row.location
        }
        for row in data
    ]

    return jsonify(rows)

if __name__ == "__main__":
    app.run(debug=True)
