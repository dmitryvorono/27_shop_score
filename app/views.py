from app.flask_server import app, db
from app import models
from flask import render_template
from flask import Response
from flask import send_from_directory
from flask import request
import json
from app import utils_orders


@app.route('/api/score_information')
def score_information():
    returned_json_data = {
        'count_completed_orders': utils_orders.get_completed_orders_on_period(),
        'count_fulfillment_orders': utils_orders.get_fulfillment_orders(),
        'max_fulfillment_orders_delay': utils_orders.get_max_fulfillment_orders_delay(),
    }
    response = Response(json.dumps(returned_json_data),
                    status=200,
                    mimetype='application/json')
    return response


@app.route('/')
def score():
    return render_template('score.html')


@app.route('/robots.txt')
def static_from_root():
    return send_from_directory(app.static_folder, request.path[1:])
