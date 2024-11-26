import https from "https";
import axios from "axios";

/**
 * Disable SSL certificate validation only in development mode
 */
if (process.env.NODE_ENV === "development") {
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });
  axios.defaults.httpsAgent = httpsAgent;
  console.log(process.env.NODE_ENV, `RejectUnauthorized is disabled.`);
}

export default axios;
