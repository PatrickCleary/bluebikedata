import geopandas as gpd
import matplotlib.pyplot as plt
import json

desired_towns = ['QUINCY','REVERE','EVERETT','MEDFORD','MALDEN','BROOKLINE','BOSTON','CAMBRIDGE','SOMERVILLE','ARLINGTON','WATERTOWN','NEWTON']
def filter_towns(town):
    name = town['properties']['TOWN20']
    print(name)
    if name in desired_towns:
        return True
    return False


gdf=gpd.read_file('../../../../CENSUS2020TOWNS_SHP/CENSUS2020TOWNS_POLY.shp')
gdf = gdf.to_crs('EPSG:4326')
geojson_data = gdf.to_json()
geojson_data = json.loads(geojson_data)

towns = list(filter(filter_towns, geojson_data['features']))
print(towns)

with open("../../../../ma_town_shape.json", "w") as outfile:
    outfile.write(json.dumps(towns))


