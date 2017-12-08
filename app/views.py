from app import app, db, models
from flask import render_template
from flask import Response
from flask import send_from_directory
from flask import request
from datetime import timedelta, datetime
import json
import pytz


@app.route('/api/score_information')
def score_information():
    returned_json_data = {
        'count_completed_orders': get_completed_orders_on_period(),
        'count_fulfillment_orders': get_fulfillment_orders(),
        'max_fulfillment_orders_delay': get_max_fulfillment_orders_delay(),
    }
    response = Response(json.dumps(returned_json_data),
                    status=200,
                    mimetype='application/json')
    return response
    
    
def get_completed_orders_on_period(days=1):
    tz = pytz.timezone('Europe/Moscow')
    orders_query = db.session.query(models.Order)
    orders_query = orders_query.filter((models.Order.created+timedelta(days))>datetime.now(tz))
    orders_query = orders_query.filter(models.Order.status == 'COMPLETED')
    return orders_query.count()


def get_fulfillment_orders():
    orders_query = db.session.query(models.Order)
    orders_query = orders_query.filter(models.Order.status == 'FULFILLMENT')
    return orders_query.count()


def get_max_fulfillment_orders_delay():
    seconds_in_minute = 60.0
    created = get_created_from_oldest_fulfillment_order()
    if created is None:
        return 0
    now = utc_to_local(datetime.now())
    difference_in_seconds = (now - created).total_seconds()
    return difference_in_seconds / seconds_in_minute


def utc_to_local(utc_dt):
    local_tz = pytz.timezone('Europe/Moscow')
    local_dt = utc_dt.replace(tzinfo=pytz.utc).astimezone(local_tz)
    local_dt = local_tz.normalize(local_dt)
    return local_dt.replace(tzinfo = None)


def get_created_from_oldest_fulfillment_order():
    orders_query = db.session.query(models.Order)
    orders_query = orders_query.filter(models.Order.status == 'FULFILLMENT')
    orders_query = orders_query.order_by(models.Order.created)
    if not orders_query.count():
        return None
    return orders_query.first().created

    
@app.route('/')
def score():
    return render_template('score.html')


@app.route('/robots.txt')
def static_from_root():
    return send_from_directory(app.static_folder, request.path[1:])
