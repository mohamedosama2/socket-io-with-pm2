module.exports = {
  apps: [
    {
      script: "worker.js",
      instances: "1",
      exec_mode: "cluster",
    },
    {
      script: "app",
      instances: "2",
      exec_mode: "cluster",
    },
  ],
};
