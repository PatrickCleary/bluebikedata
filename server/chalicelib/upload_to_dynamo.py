import boto3
import csv
import uuid

def csv_to_json(csv_file_path):
    data = []
    with open(csv_file_path, 'r') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            ride_id = str(uuid.uuid4())  # Generate a UUID for each row
            row['ride_id'] = ride_id
            if row['start_station_id'] != '':
                data.append(row)
    return data
  

def upload_to_dynamodb(table_name, data):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(table_name)
    
    with table.batch_writer() as batch:
        for item in data:
                batch.put_item(Item=item)



def upload_entry_to_dynamodb(table_name, data):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(table_name)
        # Upload the item to the DynamoDB table
    table.put_item(
        TableName=table_name,
        Item=data
    )

if __name__ == "__main__":
    # csv_file_path = "../../../../202306-bluebikes-tripdata_formatted.csv"
    csv_file_path = "../../../202206-bluebikes-tripdata_formatted.csv"
    table_name = "BlueBikeTrips"
    json_data = csv_to_json(csv_file_path)
    upload_to_dynamodb(table_name, json_data)