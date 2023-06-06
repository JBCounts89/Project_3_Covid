# Mock_Project3

There are 3 steps that will fulfill most of the requirements -- although not all; for example, the requirement to use a new JS library you haven't used before  This is hardly the best example and only has one visualization and only fake data, but it does provide a framework that you can use.  Also don't be afraid to try your own framework.

## Steps

This example has three steps:

### Step 1: ETL

I have a Jupyter notebook called `Step1_ETL.ipynb` which first gets the data, transforms it, and puts it into a database.  I used PostgreSQL, but feel free to use MongoDB or Sqlite instead.  This primarily handles the database requirement and if you save your data in the database correctly, can make your visualizations easier.

### Step 2: Flask app

To satisfy the Flask app requirement and to provide an API to that the frontend can use to get the data out of the database, I have a sample Flask app which does just that: `Step2_Flask_API_Server.py`. It satisfies the Flask app requirement and also gets the data out of the database.  Again, since I used PostgreSQL, I used the Python module `flask_sqlalchemy` to handle my database connections.  If you are using Sqlite for your database, `flask_sqlalchemy` can be used; if you are using MongoDB, you can use `flask_pymongo`.

**Caution**: I also used the `flask_cors` module to get around the Javascript app below from getting CORS error for accessing a local resource.

### Step 3: Javascript app

This is where you should be spending most of your time, since this is where the user interactivity and visualizations should be; if you have other ideas, please see me.  It illustrates how to use D3 to navigate the DOM to get access to a button and handle a click event which adds a plot to the DOM.  I didn't start with an initial plot, just so that I could show interactivity by forcing a button click to show the interaction.  I also didn't provide any CSS styling to keep the example simple.

### Steps to run

First, you will need two terminal (or Git bash) windows running.  In the first window, from the directory where you have your Flask app, you need to run the Flask app.  Here is my example:
``` bash
(PythonData)
coach@ENERGYROX1 MINGW64 ~/projects/mock_project3
$ python Step2_Flask_API_Server.py * Serving Flask app 'Step2_Flask_API_Server'
 * Debug mode: on
   WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on http://127.0.0.1:5000
   Press CTRL+C to quit
 * Restarting with watchdog (windowsapi)
 * Debugger is active!
 * Debugger PIN: 106-222-758`
```

Notice that the Flask app is running on `localhost:5000`, which is where we are reading the data from via the API call to the `/data` endpoint.

In the second window, navigate to where the `index.html` file is for your Javascript front-end visualizations and run the Python simple HTTP server with the command `python -m http.server`.  Here is my example:

```bash
(base)
coach@ENERGYROX1 MINGW64 ~/projects/mock_project3/Step3_Javascript
$ python -m http.server
Serving HTTP on :: port 8000 (http://[::]:8000/) ...
```

You should now be able to go to a local browser and type:

```url
http://localhost:8000
```

... to see your visualizations!

Good luck!
