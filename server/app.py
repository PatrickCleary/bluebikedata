import json
from chalice import Chalice, CORSConfig
import os
from chalicelib import get_destinations_by_count

app = Chalice(app_name='bluebikedataserver')

localhost = "localhost:3000"
FRONTEND_HOST = os.environ.get("FRONTEND_HOST", localhost)

cors_config = CORSConfig(allow_origin=f"https://{FRONTEND_HOST}", max_age=3600)


@app.route("/api/destinations", cors=cors_config)
def get_destinations():
    query = app.current_request.query_params
    return json.dumps(get_destinations_by_count.get_destinations_by_count(query["station_id"]))