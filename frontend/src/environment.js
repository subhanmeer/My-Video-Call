const IS_PROD = false;

const server = IS_PROD
  ? "https://your-production-backend-url.onrender.com"
  : "http://localhost:5000";

export default server;