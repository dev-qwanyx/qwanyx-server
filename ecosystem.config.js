// PM2 Configuration for running multiple Next.js apps
// Usage: pm2 start ecosystem.config.js

module.exports = {
  apps: [
    {
      name: 'autodin-next',
      cwd: './autodin-next',
      script: 'npm',
      args: 'start',
      env: {
        PORT: 3001,
        NODE_ENV: 'production',
        API_URL: 'http://localhost:5002',
        SITE_NAME: 'Autodin',
        DOMAIN: 'autodin.be'
      }
    },
    {
      name: 'belgicomics-next',
      cwd: './belgicomics-next',
      script: 'npm',
      args: 'start',
      env: {
        PORT: 3002,
        NODE_ENV: 'production',
        API_URL: 'http://localhost:5002',
        SITE_NAME: 'Belgicomics',
        DOMAIN: 'belgicomics.be'
      }
    },
    {
      name: 'qwanyx-api',
      cwd: './qwanyx-api',
      script: 'python3',
      args: 'app.py',
      env: {
        PORT: 5002,
        FLASK_ENV: 'production'
      }
    }
  ]
}