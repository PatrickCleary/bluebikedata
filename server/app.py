from decimal import Decimal
import json
from chalice import Chalice, CORSConfig, ForbiddenError
import os
from chalicelib import get_destinations_by_count, shapes_api

app = Chalice(app_name='bluebikedataserver')

localhost = "localhost:3000"
FRONTEND_HOST = os.environ.get("FRONTEND_HOST", localhost)

cors_config = CORSConfig(allow_origin=f"https://{FRONTEND_HOST}", max_age=3600)


@app.route("/api/destinations", cors=True)
def get_destinations():
    query = app.current_request.query_params
    print(query)
    return json.dumps(get_destinations_by_count.get_destinations_by_count(query["station_id"], query["start_time"], query["end_time"]))


@app.route("/api/saveconfig", cors=True, methods=['POST'])
def save_shapes():
    params = json.loads(json.dumps(app.current_request.json_body), parse_float=Decimal)
    if(len(params['configParams']['shape']) > 150):
        raise ForbiddenError("Shape is too large.")
    return shapes_api.save_config(params)

@app.route("/api/getconfig", cors=True)
def get_config():
    query = app.current_request.query_params
    print(query['id'])
    return shapes_api.get_config(query['id'])
