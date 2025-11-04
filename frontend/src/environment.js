const IS_PROD = true;

const server = IS_PROD
  ? "https://my-video-call-h35l.onrender.com"
  : "http://localhost:8001";

export default server;