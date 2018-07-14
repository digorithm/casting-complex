# Project configuration

## Running the application

The application is composed of two main apps: the client and the server. If you are deploying, run it through the base `package.json` by running `npm run dev`.

If you are developing, it will be better to run them separately in two different terminals so you can see the logs of each one. So cd into client, run `npm run dev`, in the other terminal, cd into server, run `nodemon start`

## Setting up AWS S3

credentials are in: `~/.aws/credentials`.

Remember to move this to the deployment server.