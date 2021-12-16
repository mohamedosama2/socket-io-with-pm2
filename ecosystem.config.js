module.exports = {
  apps: [
    {
      name: "app",
      script: "./app",
      instances: "3",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
