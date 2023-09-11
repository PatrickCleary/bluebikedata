from datetime import datetime
from decimal import Decimal
import json
from re import T
from chalicelib import upload_to_dynamo, dynamo

CONFIGS_TABLE = 'BlueBikeData-Configs'

def save_config(config):
    item_data = {
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'id': config['id'],
        'version': config['version'],
        **config['configParams'],
    }

    upload_to_dynamo.upload_entry_to_dynamodb('BlueBikeData-Configs', item_data)

def get_config(id):
    return dynamo.read_from_config_table(CONFIGS_TABLE, id)