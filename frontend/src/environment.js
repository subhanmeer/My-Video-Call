const IS_PROD = false;

const server = IS_PROD
  ? "https://my-video-call-h35l.onrender.com"
  : "http://localhost:5000";

export default server;