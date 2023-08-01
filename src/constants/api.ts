export const PRODUCTION = "bluebikedata.com";
export const DEV = "dev.bluebikedata.com";

const FRONTEND_TO_BACKEND_MAP = {
  [PRODUCTION]: "https://qommev9951.execute-api.us-east-1.amazonaws.com/dev",
  [DEV]: "https://qommev9951.execute-api.us-east-1.amazonaws.com/dev",
};

let domain = "";
if (typeof window !== "undefined") {
  domain = window.location.hostname;
}
export const API_URL = FRONTEND_TO_BACKEND_MAP[domain] || "";
