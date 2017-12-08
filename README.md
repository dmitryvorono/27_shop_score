# Shop Score Page

Shop Scope is a project designed to monitor the speed of execution of orders by the managers of the online shop.
The project is placed in the public domain on Heroku. [To open click here](https://blooming-ridge-74189.herokuapp.com/)

# Features

* The page refresh every 10 seconds
* Speedometer point the color according value:
    ** green — the waiting time of fulfillment orders is less than 7 minutes
    ** yellow — the delay is not more than 30 minutes
    ** red — the delay is more than 30 minutes
* Display secondary information:
    ** the count of fulfillment orders
    ** the count of orders processed per day
* Adaptive Web Design
* The website hidden from search indexing

# How to install local

Python 3 should be already installed. Then use pip (or pip3 if there is a conflict with old Python 2 setup) to install dependencies:

```bash
$ pip install -r requirements.txt # alternatively try pip3
```
Remember, it is recommended to use [virtualenv/venv](https://devman.org/encyclopedia/pip/pip_virtualenv/) for better isolation.

Next, run app:

```bash
$ python server.py
```

# Project Goals

The code is written for educational purposes. Training course for web-developers - [DEVMAN.org](https://devman.org)
