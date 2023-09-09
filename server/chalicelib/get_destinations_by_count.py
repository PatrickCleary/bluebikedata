from chalicelib import constants, dynamo
import pandas as pd
from timeit import default_timer as timer



def get_destinations_by_count(station_name: str, start_time:str, end_time:str,):
    expression_attribute_values = {
        ":start_station_id": station_name,
        ":start_time": start_time,
        ":end_time": end_time
    }
    result = dynamo.read_from_secondary_index('BlueBikeTrips', constants.dynamo_start_station_index, constants.key_condition_expression, expression_attribute_values)
    df = pd.DataFrame(result)

    # Group the DataFrame by 'start_station_id' and 'end_station_id' and count the occurrences
    station_count = df.groupby(['start_station_id', 'end_station_id']).size().reset_index(name='count')
    station_count_filtered = station_count[station_count['count'] >= 1]
    station_count_filtered = station_count_filtered.sort_values(by='count', ascending=False)

    # Convert the DataFrame to a dictionary with 'start_station_id' + 'end_station_id' as key and 'count' as value
    station_count_map = {(row['end_station_id']): row['count'] for _, row in station_count_filtered.iterrows()}
    return {'station_name':station_name,'end_docks': station_count_map}
