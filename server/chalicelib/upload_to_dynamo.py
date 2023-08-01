import boto3
import csv

def csv_to_json(csv_file_path):
    data = []
    with open(csv_file_path, 'r') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            data.append(row)
    return data
  

def upload_to_dynamodb(table_name, data):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(table_name)
    
    with table.batch_writer() as batch:
        for item in data:
                batch.put_item(Item=item)

            

if __name__ == "__main__":
    # csv_file_path = "../../../../202306-bluebikes-tripdata_formatted.csv"
    csv_file_path = "../../../202306-bluebikes-tripdata_formatted.csv"
    table_name = "BlueBikeTrips"
    json_data = csv_to_json(csv_file_path)
    upload_to_dynamodb(table_name, json_data)