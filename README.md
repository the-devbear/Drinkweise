# Drinkweise

This app was developed during my bachelor's thesis and serves as an example of
AI-supported code review.

## How to build and run the app

- Check the [Expo Documentation](https://docs.expo.dev/get-started/set-up-your-environment/) on how to prepare your device for development.
- After that, you should change the `owner` and `projectId` variables in the [App config](./app.config.js)
- Copy the `.env.example` file to a new file called ´.env´ and fill in the required API keys.
- run `yarn install:immutable` to install the dependencies.
- run `yarn prebuild`
- run `yarn ios`

The application should work
