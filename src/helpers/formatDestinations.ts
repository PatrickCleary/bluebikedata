import { FetchDestinationsResponse } from "../types/apis";

export const formatDestinations = (
  queryResults: (FetchDestinationsResponse | undefined)[]
) => {
  return queryResults.reduce((object, query) => {
    if (query)
      Object.entries(query.end_docks).forEach(([key, value]) => {
        if (object[key]) object[key] += value;
        else object[key] = value;
      });

    return object;
  }, {});
};
