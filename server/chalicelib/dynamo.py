import boto3

def read_from_secondary_index(table_name, index_name, key_condition_expression, expression_attribute_values=None, projection_expression='start_station_id, end_station_id'):
    """
    Reads data from a DynamoDB secondary index.

    Args:
        table_name (str): The name of the DynamoDB table.
        index_name (str): The name of the secondary index.
        key_condition_expression (str): The key condition expression to query the index.
        expression_attribute_values (dict, optional): A dictionary of attribute names and their values used in the expression.
        projection_expression (str, optional): A projection expression to specify which attributes to retrieve.

    Returns:
        list: A list of items matching the query from the secondary index.
    """
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(table_name)

    # Query the secondary index
    response = table.query(
        IndexName=index_name,
        KeyConditionExpression=key_condition_expression,
        ExpressionAttributeValues=expression_attribute_values,
        ProjectionExpression=projection_expression,  # Add the projection expression here
    )


    return response['Items']
