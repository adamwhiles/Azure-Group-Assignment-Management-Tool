# Tauri React App

This is a tauri app that uses react as the frontend framework. It uses the Microsoft Graph API to look up groups and find what assignments the group has on apps, configuration profiles, scripts, proactive remediations, etc.

## Features

- Cross-platform desktop app with minimal resource usage
- User-friendly interface built with react
- Secure and fast communication with the Microsoft Graph API
- Ability to view and manage group assignments on various resources

## Installation

To run this app, you need to have Node.js and Rust installed on your system. You also need to install the tauri-cli tool.

To install the dependencies, run the following commands in the project directory:

```
npm install
cargo install tauri-cli --force
```

To start the app in development mode, run:

```
npm run tauri dev
```

To build the app for production, run:

```
npm run tauri build
```

The output binaries will be in the `src-tauri/target/release` folder.

## Usage

To use the app, you need to have a Microsoft account and app registration. Log in and grant the app permission to access the Graph API. You can do this by clicking on the Sign in button on the app and following the instructions.

Once you are signed in, you can enter the name a group in the search box and click on the lookup group. The app will display the assignments that the group has for configuration profiles, apps, remediations etc.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
