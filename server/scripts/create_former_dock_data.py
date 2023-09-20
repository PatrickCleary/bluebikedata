import json
import glob
import os
import pandas as pd

def clean_strings(df):
    #TODO: Probably don't need these to be separate, but it wasn't working.
    df =  df.apply(lambda x: x.str.replace(u'\u2013', '-', regex=False) if x.dtype == 'object' else x)
    df =  df.apply(lambda x: x.str.replace(u'?', '-', regex=False) if x.dtype == 'object' else x)
    df =  df.apply(lambda x: x.str.replace(u'–', '-', regex=False) if x.dtype == 'object' else x)
    return df.apply(lambda x: x.str.strip() if x.dtype == 'object' else x)

output_folder = './output/'

# Read the stations CSV into a pandas DataFrame. TODO: get this live (and remove first row which contains lastUpdated)
current_stations_df = pd.read_csv("../../../../current_bluebikes_stations.csv", encoding="utf8")
current_stations_df = clean_strings(current_stations_df)
current_stations_df.set_index(['Name','Number'], inplace=True)

former_stations_columns = ['Number','Name','Latitude','Longitude', 'LastUsed']
former_docks_df = pd.DataFrame(columns=former_stations_columns).set_index(['Name','Number'])


files = sorted(glob.glob('../../../../BBData/*.csv'))
if(not os.path.exists('./output/')):
    os.makedirs(output_folder)

def get_old_docks(df):
    if 'tripduration' in df.columns:
        filtered_df = df[~df['start station name'].isin(current_stations_df.index.get_level_values('Name'))]
        former_docks = filtered_df.groupby(['start station name', 'start station id'])[['start station name', 'start station id', 'start station latitude', 'start station longitude', 'starttime']].last()
        former_docks.rename(columns={"start station name": "Name", "start station id": 'Number','start station latitude':'Latitude', 'start station longitude':'Longitude', 'starttime':'LastUsed'},inplace=True)
        former_docks.set_index(['Name','Number'], inplace=True)
        return former_docks
    else:
        filtered_df = df[~df['start_station_name'].isin(current_stations_df.index.get_level_values('Name'))]
        former_docks = filtered_df.groupby(['start_station_name', 'start_station_id'])[['start_station_name', 'start_station_id', 'start_lat','start_lng', 'started_at']].last()
        former_docks.rename(columns={"start_station_name": "Name", "start_station_id": 'Number','start_lat':'Latitude', 'start_lng':'Longitude', 'started_at':'LastUsed'},inplace=True)
        former_docks.set_index(['Name','Number'],inplace=True)
        return former_docks


for file in files:
    output_file_name = 'former_docks.csv'
    # Step 4: Read the CSV and perform the calculations
    all_docks = pd.read_csv(f'{file}', encoding='utf8')
    all_docks = clean_strings(all_docks)

    former_docks = get_old_docks(all_docks)
    former_docks_df  = former_docks.combine_first(former_docks_df)
former_docks_df.to_csv('../../../../former_bb_docks.csv')
all_docks = pd.concat([former_docks_df, current_stations_df])
with open('../../public/static/all_docks.json', 'w') as output_file:
    result = {}
    for name, row in all_docks.iterrows():
        key = f'{name[1]}:{name[0]}'
        result[key] = {"id": name[1],"name": name[0]}
        for column, value in row.items():
            if pd.notna(value):  # Check if the value is not NaN (not empty)
                result[key][column] = value
    json.dump(result, output_file, separators=(',', ':'))
