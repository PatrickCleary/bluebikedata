from decimal import Decimal
import json
from chalicelib import upload_to_dynamo, dynamo

SHAPES_TABLE = 'BlueBikeData-Shapes'

def save_shape(shape):
    item_data = {
        'id': shape['id'],
        'shape': json.dumps(shape['shape'])
    }

    upload_to_dynamo.upload_entry_to_dynamodb('BlueBikeData-Shapes', item_data)

def get_shape(id):
    return dynamo.read_from_shape_table(SHAPES_TABLE, id)