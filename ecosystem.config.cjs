module.exports = {
  apps: [
    {
      name: 'it-vacna-backend',
      script: 'npm',
      args: 'run start-build',
      instances: '1',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
