module.exports = {
  apps: [
    {
      script: "worker.js",
      instances: "2",
      exec_mode: "cluster",
      env: {
        PORT: 8080,
        NODE_ENV: "development",
      },
    },
    {
      script: "app",
      instances: "2",
      exec_mode: "cluster",
      env: {
        PORT: 9002,
        NODE_ENV: "development",
      },
    },
  ],
};
