module.exports = {
  apps: [
    {
      script: "app",
      instances: "2",
      exec_mode: "cluster",
    },
  ],
};
