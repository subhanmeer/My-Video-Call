const server =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://my-video-call-h35l.onrender.com";

export default server;