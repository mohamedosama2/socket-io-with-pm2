module.exports = {
  apps: [
    {
      script: "worker.js",
      instances: "2",
      exec_mode: "cluster",
      env_production: {
        PORT: 8080,
        NODE_ENV: "deployment",
      },
    },
    {
      script: "app",
      instances: "2",
      exec_mode: "cluster",
      env_production: {
        PORT: 9002,
        NODE_ENV: "deployment",
      },
    },
  ],
};
