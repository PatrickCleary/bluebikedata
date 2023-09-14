import json
from cmath import isnan
import pandas as pd
from datetime import datetime
import os
import glob

output_folder = '../../public/static/destinations_data/'

# Read the stations CSV into a pandas DataFrame
stations_df = pd.read_csv("../../../../current_bluebikes_stations.csv")
former_stations_df = pd.read_csv("../../../../former_bb_docks.csv")
all_stations_df = pd.concat([stations_df, former_stations_df])
# Create a dictionary to map Station_Name to Number (station ID)
station_mapping = dict(zip(all_stations_df['Name'], all_stations_df['Number']))
# Create a dictionary to map Station_Name to Latitude
station_latitude_mapping = dict(zip(all_stations_df['Name'], all_stations_df['Latitude']))

# Create a dictionary to map Station_Name to Longitude
station_longitude_mapping = dict(zip(all_stations_df['Name'], all_stations_df['Longitude']))

def update_station_ids(trip_df):
    # Update the start_station_id and end_station_id columns based on Station_Name mapping
    trip_df['start_station_id'] = trip_df['start station name'].map(station_mapping)
    trip_df['start_lat'] = trip_df['start station name'].map(station_latitude_mapping) # TODO: Check when these have changed between dates.
    trip_df['start_lng'] = trip_df['start station name'].map(station_longitude_mapping)

    trip_df['end_station_id'] = trip_df['end station name'].map(station_mapping)
    trip_df['end_lat'] = trip_df['end station name'].map(station_latitude_mapping)
    trip_df['end_lng'] = trip_df['end station name'].map(station_longitude_mapping)
    trip_df.drop('start station id', axis=1, inplace=True)    
    trip_df.drop('start station latitude', axis=1, inplace=True)    
    trip_df.drop('end station latitude', axis=1, inplace=True)    
    trip_df.drop('start station longitude', axis=1, inplace=True)    
    trip_df.drop('end station longitude', axis=1, inplace=True)
    trip_df.drop('end station id', axis=1, inplace=True)    

# Step 3: Define a function to calculate the trip duration in seconds
def calculate_trip_duration(row):
    started_at = datetime.strptime(row['started_at'], '%Y-%m-%d %H:%M:%S')
    ended_at = datetime.strptime(row['ended_at'], '%Y-%m-%d %H:%M:%S')
    return int((ended_at - started_at).total_seconds())

files = sorted(glob.glob('../../../../BBData/*.csv'))
if(not os.path.exists('../../public/static/destinations_data/')):
    os.makedirs(output_folder)


for file in files:
    output_file_name = f'output_{os.path.basename(file)[:6]}.json'
    # Step 4: Read the CSV and perform the calculations
    df = pd.read_csv(f'{file}')

    if 'tripduration' in df.columns:
        update_station_ids(df)
    else:
        print(f'Post-202303 - {file}')

    grouped_df = df.groupby(["start_station_id", "end_station_id"]).size().reset_index(name='Count')
    pivoted_df = grouped_df.pivot(index='start_station_id', columns='end_station_id', values='Count')
    
    station_data = pivoted_df.T.to_dict()
    json_data = {key: [{inner_key: int(value)} for inner_key, value in value.items() if not isnan(value)] for key, value in station_data.items()}

    # Write JSON data to a file
    output_file_path = f'{output_folder}{output_file_name}'
    with open(output_file_path, 'w') as output_file:
        json.dump(json_data, output_file, separators=(',', ':'))

    print("Processing complete. Results saved to", output_file)


