
# Example usage:
# Assuming you have a table named 'my_table' with a secondary index named 'my_index'.
# We want to retrieve all items from the secondary index where the 'status' attribute equals 'ACTIVE'.
dynamo_start_station_index = 'start_station_id-index'
key_condition_expression = 'start_station_id = :start_station_id'
expression_attribute_values = {':start_station_id': 'C32052'}
