import argparse
import json
from cmath import isnan
import os
import glob
from helpers import update_station_ids, read_and_clean_csv

parser = argparse.ArgumentParser(description="Ingest Bluebike trip data")
parser.add_argument("year", nargs="?", type=int, help="Year to process (e.g. 2024)")
parser.add_argument("start_month", nargs="?", type=int, help="Month or start of month range (1-12)")
parser.add_argument("end_month", nargs="?", type=int, help="End of month range (inclusive)")
args = parser.parse_args()

destination_output_folder = "../../public/static/destination_data/"
origin_output_folder = "../../public/static/origin_data/"

all_files = sorted(glob.glob("../data/BBData/*.csv"))

def file_matches(file):
    prefix = os.path.basename(file)[:6]  # YYYYMM
    if not args.year:
        return True
    file_year = int(prefix[:4])
    file_month = int(prefix[4:6])
    if file_year != args.year:
        return False
    if args.start_month and args.end_month:
        return args.start_month <= file_month <= args.end_month
    if args.start_month:
        return file_month == args.start_month
    return True

files = [f for f in all_files if file_matches(f)]
print(f"Processing {len(files)} of {len(all_files)} files")
if not os.path.exists(destination_output_folder):
    os.makedirs(destination_output_folder)
if not os.path.exists(origin_output_folder):
    os.makedirs(origin_output_folder)

for file in files:
    output_file_name = f"output_{os.path.basename(file)[:6]}.json"
    # Step 4: Read the CSV and perform the calculations
    df = read_and_clean_csv(file)
    if (
        "tripduration" in df.columns
    ):  # if it has `tripduration` it is pre-March 2023. So it has different IDs
        update_station_ids(df)

    grouped_df = (
        df.groupby(["start_station_id", "end_station_id"])
        .size()
        .reset_index(name="Count")
    )

    destination_pivoted_df = grouped_df.pivot(
        index="end_station_id", columns="start_station_id", values="Count"
    )
    origin_pivoted_df = grouped_df.pivot(
        index="start_station_id", columns="end_station_id", values="Count"
    )
    for output_type in ["destination", "origin"]:
        pivoted_df = (
            destination_pivoted_df
            if output_type == "destination"
            else origin_pivoted_df
        )
        station_data = pivoted_df.T.to_dict()
        json_data = {
            key: [
                {inner_key: int(value)}
                for inner_key, value in value.items()
                if not isnan(value)
            ]
            for key, value in station_data.items()
        }

        # Write destinations JSON data to a file
        output_folder = (
            destination_output_folder
            if output_type == "destination"
            else origin_output_folder
        )
        output_file_path = f"{output_folder}{output_file_name}"
        with open(output_file_path, "w") as output_file:
            json.dump(json_data, output_file, separators=(",", ":"))
        print("Processing complete. Results saved to", output_file_path)
