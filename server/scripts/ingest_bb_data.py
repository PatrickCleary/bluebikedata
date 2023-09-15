import json
from cmath import isnan
import os
import glob
from helpers import update_station_ids, read_and_clean_csv

destinations_output_folder = '../../public/static/destinations_data/'
origins_output_folder = '../../public/static/origins_data/'

files = sorted(glob.glob('../../../../BBData/*.csv'))
if(not os.path.exists(destinations_output_folder)):
    os.makedirs(destinations_output_folder)
if(not os.path.exists(origins_output_folder)):
    os.makedirs(origins_output_folder)

for file in files:
    output_file_name = f'output_{os.path.basename(file)[:6]}.json'
    # Step 4: Read the CSV and perform the calculations
    df = read_and_clean_csv(file)
    if 'tripduration' in df.columns: #if it has `tripduration` it is pre-March 2023. So it has different IDs
        update_station_ids(df)

    grouped_df = df.groupby(["start_station_id", "end_station_id"]).size().reset_index(name='Count')

    destinations_pivoted_df = grouped_df.pivot(index='start_station_id', columns='end_station_id', values='Count')
    origins_pivoted_df = grouped_df.pivot(index='end_station_id', columns='start_station_id', values='Count')
    for output_type in ['destinations', 'origins']:
        pivoted_df = destinations_pivoted_df if output_type == 'destinations' else origins_pivoted_df
        station_data = pivoted_df.T.to_dict()
        json_data = {key: [{inner_key: int(value)} for inner_key, value in value.items() if not isnan(value)] for key, value in station_data.items()}

        # Write destinations JSON data to a file
        output_folder = destinations_output_folder if output_type == 'destinations' else origins_output_folder
        output_file_path = f'{output_folder}{output_file_name}'
        with open(output_file_path, 'w') as output_file:
            json.dump(json_data, output_file, separators=(',', ':'))
        print("Processing complete. Results saved to", output_file_path)