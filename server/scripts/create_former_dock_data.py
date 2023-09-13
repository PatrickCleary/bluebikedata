import glob
import os
import pandas as pd

output_folder = './output/'

# Read the stations CSV into a pandas DataFrame. TODO: get this live (and remove first row which contains lastUpdated)
current_stations_df = pd.read_csv("../../../../current_bluebikes_stations.csv")

former_stations_columns = ['Number','Name','Latitude','Longitude', 'LastUsed']
former_docks_df = pd.DataFrame(columns=former_stations_columns).set_index('Number')


files = sorted(glob.glob('../../../../BBData/*.csv'))
if(not os.path.exists('./output/')):
    os.makedirs(output_folder)


def get_old_docks(df):
    if 'tripduration' in df.columns:
        filtered_df = df[~df['start station name'].isin(current_stations_df['Name'])]
        former_docks = filtered_df.groupby(['start station name'])[['start station name', 'start station id', 'start station latitude', 'start station longitude', 'starttime']].last()
        return former_docks.rename(columns={"start station name": "Name", "start station id": 'Number','start station latitude':'Latitude', 'start station longitude':'Longitude', 'starttime':'LastUsed'}).set_index("Number")
    else:
        filtered_df = df[~df['start_station_name'].isin(current_stations_df['Name'])]
        former_docks = filtered_df.groupby(['start_station_name'])[['start_station_name', 'start_station_id', 'start_lat','start_lng', 'started_at']].last()
        return former_docks.rename(columns={"start_station_name": "Name", "start_station_id": 'Number','start_lat':'Latitude', 'start_lng':'Longitude', 'started_at':'LastUsed'}).set_index("Number")


for file in files:
    output_file_name = 'former_docks.csv'
    # Step 4: Read the CSV and perform the calculations
    df = pd.read_csv(f'{file}')
    former_docks = get_old_docks(df)
    former_docks_df  = former_docks.combine_first(former_docks_df)
former_docks_df.to_csv('../../../../former_bb_docks.csv')


