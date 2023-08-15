from cmath import isnan
import pandas as pd
import json
if __name__ == '__main__':
    csv_file_path = "../../../../202306-bluebikes-tripdata_formatted.csv"
    df = pd.read_csv(csv_file_path)
    grouped_df = df.groupby(["start_station_id", "end_station_id"]).size().reset_index(name='Count')
    pivoted_df = grouped_df.pivot(index='start_station_id', columns='end_station_id', values='Count')
    
    station_data = pivoted_df.T.to_dict()
    json_data = {key: [{inner_key: int(value)} for inner_key, value in value.items() if not isnan(value)] for key, value in station_data.items()}

    # Write JSON data to a file
    output_file_path = '../../src/static/2023_output.json'
    with open(output_file_path, 'w') as output_file:
        json.dump(json_data, output_file, separators=(',', ':'))