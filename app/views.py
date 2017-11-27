from app import app, db, models
from flask import render_template
from flask import Response
from datetime import timedelta, datetime
import json


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
    orders_query = db.session.query(models.Order)
    orders_query = orders_query.filter((models.Order.created+timedelta(days))>datetime.now())
    orders_query = orders_query.filter(models.Order.status == 'COMPLETED')
    return orders_query.count()


def get_fulfillment_orders():
    orders_query = db.session.query(models.Order)
    orders_query = orders_query.filter(models.Order.status == 'FULFILLMENT')
    return orders_query.count()


def get_max_fulfillment_orders_delay():
    created = get_created_from_oldest_fulfillment_order()
    if created is None:
        return 0
    print(datetime.now())
    print(created)
    return (datetime.now() - created).total_seconds() / 60.0


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