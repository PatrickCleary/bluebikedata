import pandas as pd
from geopy.distance import geodesic
from datetime import datetime

def read_and_clean_csv(file_name):
    df = pd.read_csv(file_name, encoding="utf8")
    df =  df.apply(lambda x: x.str.replace(u'\u2013', '-', regex=False) if x.dtype == 'object' else x)
    df =  df.apply(lambda x: x.str.replace(u'–', '-', regex=False) if x.dtype == 'object' else x)
    df =  df.apply(lambda x: x.str.replace(u'?', '-', regex=False) if x.dtype == 'object' else x)
    return df.apply(lambda x: x.str.strip() if x.dtype == 'object' else x)

# Read the stations CSV into a pandas DataFrame
stations_df = read_and_clean_csv("../../../../current_bluebikes_stations.csv")
former_stations_df = pd.read_csv("../../../../former_bb_docks.csv", encoding="utf8")
all_stations_df = pd.concat([stations_df, former_stations_df])

# Create dictionaries to map Station Names to Numbers and coordinates.
station_mapping = dict(zip(all_stations_df['Name'], all_stations_df['Number']))
station_latitude_mapping = dict(zip(all_stations_df['Name'], all_stations_df['Latitude']))
station_longitude_mapping = dict(zip(all_stations_df['Name'], all_stations_df['Longitude']))


def update_station_ids(trip_df):
    # Update the start_station_id and end_station_id columns based on Station_Name mapping
    trip_df['start_station_id'] = trip_df['start station name'].map(station_mapping)
    trip_df['start_lat'] = trip_df['start station name'].map(station_latitude_mapping) # TODO: Check when these have changed between dates.
    trip_df['start_lng'] = trip_df['start station name'].map(station_longitude_mapping)

    trip_df['end_station_id'] = trip_df['end station name'].map(station_mapping)
    trip_df['end_lat'] = trip_df['end station name'].map(station_latitude_mapping)
    trip_df['end_lng'] = trip_df['end station name'].map(station_longitude_mapping)
    trip_df.rename(columns={'tripduration': 'trip_duration'}, inplace=True)
    trip_df.drop('start station id', axis=1, inplace=True)
    trip_df.drop('start station latitude', axis=1, inplace=True)    
    trip_df.drop('end station latitude', axis=1, inplace=True)    
    trip_df.drop('start station longitude', axis=1, inplace=True)    
    trip_df.drop('end station longitude', axis=1, inplace=True)
    trip_df.drop('end station id', axis=1, inplace=True)    

distance_map = dict({})
# Step 2: Define a function to calculate the distance between two (lat, long) points
def calculate_mph(row):
    start_id = row['start_station_id']
    end_id = row['end_station_id']
    start_lat = row['start_lat']
    start_lng = row['start_lng']
    end_lat = row['end_lat']
    end_lng = row['end_lng']
    distance = distance_map.get(f'{start_id}{end_id}')
    if(distance is None):
        # Check for null coordinates
        if pd.isnull(start_lat) or pd.isnull(start_lng) or pd.isnull(end_lat) or pd.isnull(end_lng):
            return None
        start_coords = (start_lat, start_lng)
        end_coords = (end_lat, end_lng)
        distance = geodesic(start_coords, end_coords).miles
        distance_map[f'{start_id}{end_id}'] = distance

    trip_duration = row['trip_duration']
    if(trip_duration is None):
        trip_duration = calculate_trip_duration(row)

    return distance / (trip_duration / 3600)



# Step 3: Define a function to calculate the trip duration in seconds
def calculate_trip_duration(row):
    started_at = datetime.strptime(row['started_at'], '%Y-%m-%d %H:%M:%S')
    ended_at = datetime.strptime(row['ended_at'], '%Y-%m-%d %H:%M:%S')
    return int((ended_at - started_at).total_seconds())
